import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { useLang } from '../context/LangContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartContext();
  const { t } = useLang();
  
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Ташкент',
    region: '',
    comment: ''
  });
  
  const [deliveryAddresses, setDeliveryAddresses] = useState([
    { id: 1, address: 'ул. Навои, 45', city: 'Ташкент', isDefault: true },
    { id: 2, address: 'ул. Амира Темура, 12', city: 'Ташкент', isDefault: false },
  ]);
  
  const [pickupPoints, setPickupPoints] = useState([
    { id: 1, name: 'Пункт выдачи №1', address: 'ул. Навои, 45', workingHours: '09:00-20:00' },
    { id: 2, name: 'Пункт выдачи №2', address: 'ул. Амира Темура, 12', workingHours: '09:00-20:00' },
    { id: 3, name: 'Пункт выдачи №3', address: 'ул. Шота Руставели, 78', workingHours: '10:00-19:00' },
  ]);
  
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [isNewAddress, setIsNewAddress] = useState(false);
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateDeliveryCost = () => {
    if (deliveryMethod === 'pickup') return 0;
    
    // Первые 3 доставки бесплатно, остальные - 20,000 сум
    const deliveryCount = localStorage.getItem('deliveryCount') || 0;
    return deliveryCount >= 3 ? 20000 : 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Сохраняем заказ
      const order = {
        id: Date.now(),
        items: cart,
        userInfo,
        deliveryMethod,
        paymentMethod,
        deliveryCost: calculateDeliveryCost(),
        total: calculateTotal() + calculateDeliveryCost(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // Сохраняем в localStorage (в реальном приложении отправляем на сервер)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Увеличиваем счетчик доставок
      if (deliveryMethod === 'delivery') {
        const deliveryCount = parseInt(localStorage.getItem('deliveryCount') || '0') + 1;
        localStorage.setItem('deliveryCount', deliveryCount.toString());
      }
      
      // Очищаем корзину
      clearCart();
      
      // Переходим на страницу успеха
      navigate(`/order-success/${order.id}`);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const addNewAddress = () => {
    if (userInfo.address && userInfo.city) {
      const newAddress = {
        id: Date.now(),
        address: userInfo.address,
        city: userInfo.city,
        isDefault: false
      };
      setDeliveryAddresses([...deliveryAddresses, newAddress]);
      setSelectedAddress(newAddress.id);
      setIsNewAddress(false);
      setUserInfo(prev => ({ ...prev, address: '' }));
    }
  };
  
  const total = calculateTotal();
  const deliveryCost = calculateDeliveryCost();
  const finalTotal = total + deliveryCost;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Оформление заказа</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Steps */}
        <div className="lg:col-span-2">
          {/* Progress steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className={`text-sm font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                Контактные данные
              </span>
            </div>
            
            <div className="h-0.5 flex-1 bg-gray-200 mx-4"></div>
            
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                Подтверждение
              </span>
            </div>
          </div>
          
          {/* Step 1: Contact info and delivery */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Имя и фамилия *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="ivan@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Город
                    </label>
                    <select
                      name="city"
                      value={userInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Ташкент">Ташкент</option>
                      <option value="Самарканд">Самарканд</option>
                      <option value="Бухара">Бухара</option>
                      <option value="Хива">Хива</option>
                      <option value="Наманган">Наманган</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Delivery method */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Способ получения</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="pickup"
                      name="delivery"
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                      className="w-5 h-5 text-red-600"
                    />
                    <label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Самовывоз из пункта выдачи</p>
                          <p className="text-sm text-gray-500">Бесплатно</p>
                        </div>
                        <span className="text-green-600 font-medium">Бесплатно</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="delivery"
                      name="delivery"
                      checked={deliveryMethod === 'delivery'}
                      onChange={() => setDeliveryMethod('delivery')}
                      className="w-5 h-5 text-red-600"
                    />
                    <label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Доставка курьером</p>
                          <p className="text-sm text-gray-500">
                            {calculateDeliveryCost() === 0 ? 'Бесплатно (первые 3 доставки)' : '20,000 сум'}
                          </p>
                        </div>
                        <span className={`font-medium ${calculateDeliveryCost() === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {calculateDeliveryCost() === 0 ? 'Бесплатно' : '20,000 сум'}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Pickup points */}
                {deliveryMethod === 'pickup' && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Выберите пункт выдачи</h3>
                    <div className="space-y-3">
                      {pickupPoints.map(point => (
                        <div
                          key={point.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPickupPoint === point.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPickupPoint(point.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              id={`point-${point.id}`}
                              name="pickupPoint"
                              checked={selectedPickupPoint === point.id}
                              onChange={() => setSelectedPickupPoint(point.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{point.name}</p>
                              <p className="text-sm text-gray-600">{point.address}</p>
                              <p className="text-xs text-gray-500 mt-1">Часы работы: {point.workingHours}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Delivery address */}
                {deliveryMethod === 'delivery' && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Адрес доставки</h3>
                    
                    {!isNewAddress ? (
                      <>
                        <div className="space-y-3 mb-4">
                          {deliveryAddresses.map(address => (
                            <div
                              key={address.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedAddress === address.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedAddress(address.id)}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  id={`address-${address.id}`}
                                  name="address"
                                  checked={selectedAddress === address.id}
                                  onChange={() => setSelectedAddress(address.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900">{address.city}</p>
                                    {address.isDefault && (
                                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">По умолчанию</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{address.address}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setIsNewAddress(true)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Добавить новый адрес
                        </button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Адрес *
                          </label>
                          <input
                            type="text"
                            value={userInfo.address}
                            onChange={(e) => setUserInfo(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="ул. Примерная, д. 123, кв. 45"
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={addNewAddress}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Сохранить адрес
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsNewAddress(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Payment method */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Способ оплаты</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="cash"
                      name="payment"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="w-5 h-5 text-red-600"
                    />
                    <label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Наличными при получении</p>
                          <p className="text-sm text-gray-500">Оплата наличными курьеру или в пункте выдачи</p>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-5 h-5 text-red-600"
                    />
                    <label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Банковской картой онлайн</p>
                          <p className="text-sm text-gray-500">Оплата картой Visa, Mastercard, Humo, Uzcard</p>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">Mastercard</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">Humo</span>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="click"
                      name="payment"
                      checked={paymentMethod === 'click'}
                      onChange={() => setPaymentMethod('click')}
                      className="w-5 h-5 text-red-600"
                    />
                    <label htmlFor="click" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Click</p>
                          <p className="text-sm text-gray-500">Оплата через систему Click</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Click</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Comment */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Комментарий к заказу</h2>
                <textarea
                  name="comment"
                  value={userInfo.comment}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Дополнительные пожелания к заказу..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Продолжить
                </button>
              </div>
            </form>
          )}
          
          {/* Step 2: Confirmation */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Подтверждение заказа</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Контактная информация</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{userInfo.name}</p>
                      <p className="text-sm text-gray-600">{userInfo.phone}</p>
                      {userInfo.email && <p className="text-sm text-gray-600">{userInfo.email}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Способ получения</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">
                        {deliveryMethod === 'pickup' ? 'Самовывоз из пункта выдачи' : 'Доставка курьером'}
                      </p>
                      {deliveryMethod === 'pickup' ? (
                        <p className="text-sm text-gray-600">
                          {pickupPoints.find(p => p.id === selectedPickupPoint)?.name}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {deliveryAddresses.find(a => a.id === selectedAddress)?.address}, {userInfo.city}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Способ оплаты</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">
                        {paymentMethod === 'cash' && 'Наличными при получении'}
                        {paymentMethod === 'card' && 'Банковской картой онлайн'}
                        {paymentMethod === 'click' && 'Click'}
                      </p>
                    </div>
                  </div>
                  
                  {userInfo.comment && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Комментарий</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">{userInfo.comment}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Подтвердить заказ
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Right column - Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ваш заказ</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image || 'https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=No+Image'}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">{item.quantity} шт.</span>
                      <span className="text-sm font-medium text-gray-900">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} сум
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Товары ({cart.length})</span>
                <span className="font-medium">{total.toLocaleString('ru-RU')} сум</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Доставка</span>
                <span className={`font-medium ${deliveryCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost.toLocaleString('ru-RU')} сум`}
                </span>
              </div>
              
              {deliveryCost > 0 && (
                <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
                  <p>Первые 3 доставки бесплатно. Это ваша {parseInt(localStorage.getItem('deliveryCount') || '0') + 1}-я доставка.</p>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-base font-bold">
                  <span>Итого</span>
                  <span>{finalTotal.toLocaleString('ru-RU')} сум</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-xs text-gray-500 space-y-2">
              <p>Нажимая "Подтвердить заказ", вы соглашаетесь с условиями обработки персональных данных и правилами возврата.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}