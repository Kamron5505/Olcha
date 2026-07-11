import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  
  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API
    // Сейчас просто получаем из localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find(o => o.id.toString() === orderId);
    setOrder(foundOrder);
  }, [orderId]);
  
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Загрузка информации о заказе...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Заказ успешно оформлен!</h1>
          <p className="text-gray-600">
            Номер вашего заказа: <span className="font-semibold">#{order.id}</span>
          </p>
        </div>
        
        {/* Order details */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Детали заказа</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Статус заказа</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="font-medium text-yellow-600">Ожидает обработки</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Дата оформления</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Способ получения</p>
                <p className="font-medium">
                  {order.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка курьером'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Способ оплаты</p>
                <p className="font-medium">
                  {order.paymentMethod === 'cash' && 'Наличными при получении'}
                  {order.paymentMethod === 'card' && 'Банковской картой онлайн'}
                  {order.paymentMethod === 'click' && 'Click'}
                </p>
              </div>
            </div>
            
            {order.userInfo.comment && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Комментарий к заказу</p>
                <p className="text-gray-700">{order.userInfo.comment}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Order items */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Состав заказа</h2>
          
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image || 'https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=No+Image'}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500">{item.quantity} шт. × {item.price.toLocaleString('ru-RU')} сум</span>
                    <span className="font-medium text-gray-900">
                      {(item.price * item.quantity).toLocaleString('ru-RU')} сум
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-100 mt-6 pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Товары ({order.items.length})</span>
              <span className="font-medium">{order.total.toLocaleString('ru-RU')} сум</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Доставка</span>
              <span className={`font-medium ${order.deliveryCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                {order.deliveryCost === 0 ? 'Бесплатно' : `${order.deliveryCost.toLocaleString('ru-RU')} сум`}
              </span>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Итого к оплате</span>
                <span>{order.finalTotal?.toLocaleString('ru-RU') || (order.total + order.deliveryCost).toLocaleString('ru-RU')} сум</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Next steps */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Что дальше?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-blue-900">Подтверждение заказа</p>
                <p className="text-sm text-blue-700">
                  Наш менеджер свяжется с вами в течение 30 мину�� для подтверждения заказа.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-blue-900">
                  {order.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка'}
                </p>
                <p className="text-sm text-blue-700">
                  {order.deliveryMethod === 'pickup'
                    ? 'Вы сможете забрать заказ из выбранного пункта выдачи после подтверждения.'
                    : 'Курьер доставит заказ по указанному адресу в согласованное время.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-blue-900">Оплата</p>
                <p className="text-sm text-blue-700">
                  {order.paymentMethod === 'cash'
                    ? 'Оплата наличными при получении заказа.'
                    : 'Оплата будет произведена выбранным способом.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-center transition-colors"
          >
            Вернуться на главную
          </Link>
          
          <Link
            to="/catalog"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center transition-colors"
          >
            Продолжить покупки
          </Link>
          
          <button
            onClick={() => window.print()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Распечатать заказ
          </button>
        </div>
        
        {/* Contact info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Если у вас есть вопросы по заказу, свяжитесь с нами:</p>
          <p className="mt-1">
            Телефон: <a href="tel:+998901234567" className="text-red-600 hover:text-red-700">+998 90 123 45 67</a> | 
            Email: <a href="mailto:support@olcha.uz" className="text-red-600 hover:text-red-700">support@olcha.uz</a>
          </p>
        </div>
      </div>
    </div>
  );
}