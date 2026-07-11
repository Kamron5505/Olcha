import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../services/api/adminApi';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'date'
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkAuth();
    loadOrders();
  }, [filters]);

  const checkAuth = () => {
    const auth = adminApi.auth.checkAuth();
    if (!auth.isAuthenticated) {
      navigate('/admin/login');
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await adminApi.orders.getAll(filters);
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await adminApi.orders.updateStatus(orderId, newStatus);
      if (result.success) {
        loadOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(result.data);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        const result = await adminApi.orders.delete(orderId);
        if (result.success) {
          loadOrders();
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(null);
            setShowDetails(false);
          }
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const viewOrderDetails = async (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'processing': return 'В обработке';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Управление заказами</h1>
              <p className="text-sm text-gray-600">Всего заказов: {orders.length}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Назад в дашборд
              </button>
              <button
                onClick={loadOrders}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                Обновить
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус заказа
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Все статусы</option>
                <option value="pending">Ожидает обработки</option>
                <option value="processing">В обработке</option>
                <option value="shipped">Отправлен</option>
                <option value="delivered">Доставлен</option>
                <option value="cancelled">Отменен</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сортировка
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="date">По дате (новые)</option>
                <option value="total">По сумме (большие)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Поиск
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="ID заказа или имя клиента"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500">Заказы не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">ID</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Клиент</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Дата</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Сумма</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Статус</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium text-gray-900">{formatPrice(order.total)} сум</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Подробнее
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order details modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Заказ #{selectedOrder.id}</h2>
                <p className="text-sm text-gray-600">Клиент: {selectedOrder.customer}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о заказе</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Статус</p>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusText(selectedOrder.status)}
                          </span>
                          
                          <select
                            value={selectedOrder.status}
                            onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                          >
                            <option value="pending">Ожидает</option>
                            <option value="processing">В обработке</option>
                            <option value="shipped">Отправлен</option>
                            <option value="delivered">Доставлен</option>
                            <option value="cancelled">Отменен</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Дата заказа</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(selectedOrder.date)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Общая сумма</p>
                        <p className="text-xl font-bold text-gray-900">{formatPrice(selectedOrder.total)} сум</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о клиенте</h3>
                    
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Имя</p>
                        <p className="text-sm font-medium text-gray-900">{selectedOrder.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Телефон</p>
                        <p className="text-sm font-medium text-gray-900">+998901234567</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">customer@example.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Состав заказа</h3>
                  
                  <div className="space-y-4">
                    {/* Mock items */}
                    {[
                      { id: 1, name: 'iPhone 15 Pro', price: 14999000, quantity: 1 },
                      { id: 2, name: 'Чехол для iPhone', price: 299000, quantity: 2 }
                    ].map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="w-12 h-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">{item.quantity} × {formatPrice(item.price)} сум</span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatPrice(item.price * item.quantity)} сум
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Totals */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Товары</span>
                        <span className="font-medium">{formatPrice(selectedOrder.total - 20000)} сум</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Доставка</span>
                        <span className="font-medium">20,000 сум</span>
                      </div>
                      <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                        <span>Итого</span>
                        <span>{formatPrice(selectedOrder.total)} сум</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Закрыть
                </button>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (window.confirm('Отправить уведомление клиенту?')) {
                        alert('Уведомление отправлено!');
                      }
                    }}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Уведомить клиента
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Распечатать
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}