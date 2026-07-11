import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  // Mock admin credentials (в реальном приложении это должно быть на сервере)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };
  
  useEffect(() => {
    // Проверяем авторизацию
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadOrders();
    }
  }, []);
  
  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (loginData.username === ADMIN_CREDENTIALS.username && 
        loginData.password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      loadOrders();
    } else {
      alert('Неверные учетные данные');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setSelectedOrder(null);
  };
  
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };
  
  const deleteOrder = (orderId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };
  
  const filteredOrders = orders.filter(order => {
    // Фильтр по статусу
    if (filter !== 'all' && order.status !== filter) {
      return false;
    }
    
    // Поиск
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        order.id.toString().includes(searchLower) ||
        order.userInfo.name.toLowerCase().includes(searchLower) ||
        order.userInfo.phone.includes(search) ||
        order.userInfo.email?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
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
      case 'pending': return 'Ожидает обработки';
      case 'processing': return 'В обработке';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
            <p className="text-gray-600 mt-2">Войдите для управления заказами</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя пользователя
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              Войти
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Тестовые учетные данные:</p>
            <p className="font-mono mt-1">Логин: admin | Пароль: admin123</p>
          </div>
        </div>
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
              <h1 className="text-xl font-bold text-gray-900">Админ-панель</h1>
              <p className="text-sm text-gray-600">Управление заказами</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Всего заказов: <span className="font-bold">{orders.length}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Orders list */}
          <div className="lg:col-span-2">
            {/* Filters and search */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск по ID, имени, телефону..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">Все статусы</option>
                    <option value="pending">Ожидает обработки</option>
                    <option value="processing">В обработке</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                  
                  <button
                    onClick={loadOrders}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Обновить
                  </button>
                </div>
              </div>
            </div>
            
            {/* Orders list */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Заказы не найдены</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Клиент
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Сумма
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Статус
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredOrders.map(order => (
                        <tr 
                          key={order.id}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedOrder?.id === order.id ? 'bg-red-50' : ''}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{order.userInfo.name}</p>
                              <p className="text-xs text-gray-500">{order.userInfo.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {(order.total + order.deliveryCost).toLocaleString('ru-RU')} сум
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteOrder(order.id);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column - Order details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Заказ #{selectedOrder.id}</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Order info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Статус</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Дата создания</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Клиент</p>
                    <div className="space-y-1">
                      <p className="font-medium">{selectedOrder.userInfo.name}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.userInfo.phone}</p>
                      {selectedOrder.userInfo.email && (
                        <p className="text-sm text-gray-600">{selectedOrder.userInfo.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Способ получения</p>
                    <p className="font-medium">
                      {selectedOrder.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка курьером'}
                    </p>
                    {selectedOrder.deliveryMethod === 'delivery' && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedOrder.userInfo.city}, {selectedOrder.userInfo.address}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Способ оплаты</p>
                    <p className="font-medium">
                      {selectedOrder.paymentMethod === 'cash' && 'Наличными при получении'}
                      {selectedOrder.paymentMethod === 'card' && 'Банковской картой онлайн'}
                      {selectedOrder.paymentMethod === 'click' && 'Click'}
                    </p>
                  </div>
                  
                  {selectedOrder.userInfo.comment && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Комментарий</p>
                      <p className="text-sm text-gray-700">{selectedOrder.userInfo.comment}</p>
                    </div>
                  )}
                </div>
                
                {/* Order items */}
                <div className="border-t border-gray-100 pt-6 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Товары</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={item.image || 'https://via.placeholder.com/48x48/f3f4f6/9ca3af?text=No+Image'}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{item.quantity} шт.</span>
                            <span className="text-sm font-medium text-gray-900">
                              {(item.price * item.quantity).toLocaleString('ru-RU')} сум
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Товары</span>
                      <span className="font-medium">{selectedOrder.total.toLocaleString('ru-RU')} сум</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Доставка</span>
                      <span className="font-medium">{selectedOrder.deliveryCost.toLocaleString('ru-RU')} сум</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                      <span>Итого</span>
                      <span>{(selectedOrder.total + selectedOrder.deliveryCost).toLocaleString('ru-RU')} сум</span>
                    </div>
                  </div>
                </div>
                
                {/* Status actions */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Изменить статус</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        disabled={selectedOrder.status === status}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {getStatusText(status)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">Выберите заказ для просмотра деталей</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}