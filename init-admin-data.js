// Скрипт для инициализации тестовых данных админ-панели
// Запустите этот код в консоли браузера на странице админ-панели

(function initAdminData() {
  console.log('Инициализация тестовых данных админ-панели...');
  
  // Очищаем старые данные
  localStorage.removeItem('admin_data');
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  
  // Создаем тестовые данные
  const mockData = {
    users: [
      { id: 1, name: 'Администратор', email: 'admin@olcha.uz', role: 'admin', createdAt: '2024-01-01' },
      { id: 2, name: 'Менеджер', email: 'manager@olcha.uz', role: 'manager', createdAt: '2024-01-02' },
      { id: 3, name: 'Иван Иванов', email: 'ivan@example.com', role: 'user', createdAt: '2024-01-03' },
      { id: 4, name: 'Анна Петрова', email: 'anna@example.com', role: 'user', createdAt: '2024-01-04' },
    ],
    products: [
      { id: 1, name: 'iPhone 15 Pro', price: 14999000, category: 'Смартфоны', stock: 15, status: 'active' },
      { id: 2, name: 'Samsung Galaxy S24', price: 12999000, category: 'Смартфоны', stock: 8, status: 'active' },
      { id: 3, name: 'MacBook Air M2', price: 17999000, category: 'Ноутбуки', stock: 5, status: 'active' },
      { id: 4, name: 'Sony PlayStation 5', price: 8999000, category: 'Игровые консоли', stock: 0, status: 'out_of_stock' },
      { id: 5, name: 'Samsung QLED 4K TV', price: 15999000, category: 'Телевизоры', stock: 3, status: 'active' },
      { id: 6, name: 'Apple Watch Series 9', price: 5999000, category: 'Гаджеты', stock: 12, status: 'active' },
    ],
    categories: [
      { id: 1, name: 'Смартфоны', slug: 'smartphones', productCount: 45 },
      { id: 2, name: 'Ноутбуки', slug: 'laptops', productCount: 32 },
      { id: 3, name: 'Телевизоры', slug: 'tvs', productCount: 28 },
      { id: 4, name: 'Бытовая техника', slug: 'appliances', productCount: 67 },
      { id: 5, name: 'Игровые консоли', slug: 'gaming', productCount: 12 },
    ],
    orders: [
      { id: 1001, customer: 'Иван Иванов', total: 17998000, status: 'pending', date: '2024-03-25' },
      { id: 1002, customer: 'Анна Петрова', total: 12999000, status: 'processing', date: '2024-03-24' },
      { id: 1003, customer: 'Сергей Сидоров', total: 8999000, status: 'delivered', date: '2024-03-23' },
      { id: 1004, customer: 'Мария Ковалева', total: 24999000, status: 'shipped', date: '2024-03-22' },
      { id: 1005, customer: 'Алексей Смирнов', total: 15999000, status: 'pending', date: '2024-03-21' },
    ],
    settings: {
      siteName: 'Olcha.uz',
      currency: 'UZS',
      deliveryCost: 20000,
      freeDeliveryThreshold: 3,
      maintenanceMode: false
    }
  };
  
  // Сохраняем данные
  localStorage.setItem('admin_data', JSON.stringify(mockData));
  
  // Создаем тестового пользователя для входа
  const adminUser = {
    id: 1,
    name: 'Администратор',
    email: 'admin@olcha.uz',
    role: 'admin'
  };
  
  // Сохраняем данные для авторизации
  localStorage.setItem('admin_user', JSON.stringify(adminUser));
  localStorage.setItem('admin_token', btoa('admin@olcha.uz:' + Date.now()));
  
  console.log('✅ Тестовые данные успешно созданы!');
  console.log('Данные для входа:');
  console.log('Email: admin@olcha.uz');
  console.log('Пароль: admin123');
  console.log('\nСтруктура данных:');
  console.log('- Пользователи:', mockData.users.length);
  console.log('- Товары:', mockData.products.length);
  console.log('- Заказы:', mockData.orders.length);
  console.log('- Категории:', mockData.categories.length);
  console.log('\nДля входа в админ-панель:');
  console.log('1. Перейдите на страницу /admin/login');
  console.log('2. Используйте email: admin@olcha.uz');
  console.log('3. Пароль: admin123');
  
  return mockData;
})();