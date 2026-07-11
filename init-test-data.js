// Скрипт для инициализации тестовых данных
// Запустить в консоли браузера на странице приложения

function initTestData() {
  console.log('Инициализация тестовых данных...');
  
  // Очищаем старые данные
  localStorage.removeItem('orders');
  localStorage.removeItem('deliveryCount');
  localStorage.removeItem('adminAuth');
  
  // Создаем тестовые заказы
  const testOrders = [
    {
      id: 1001,
      items: [
        {
          id: 1,
          name: 'Смартфон Apple iPhone 15 Pro Max 256GB',
          price: 14999000,
          quantity: 1,
          image: 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=iPhone'
        },
        {
          id: 2,
          name: 'Наушники Apple AirPods Pro 2',
          price: 2999000,
          quantity: 1,
          image: 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=AirPods'
        }
      ],
      userInfo: {
        name: 'Иван Иванов',
        phone: '+998901234567',
        email: 'ivan@example.com',
        city: 'Ташкент',
        address: 'ул. Навои, 45',
        comment: 'Позвонить за час до доставки'
      },
      deliveryMethod: 'delivery',
      paymentMethod: 'cash',
      deliveryCost: 0,
      total: 17998000,
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 день назад
    },
    {
      id: 1002,
      items: [
        {
          id: 3,
          name: 'Ноутбук MacBook Air M2 13" 256GB',
          price: 12999000,
          quantity: 1,
          image: 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=MacBook'
        }
      ],
      userInfo: {
        name: 'Анна Петрова',
        phone: '+998902345678',
        email: 'anna@example.com',
        city: 'Самарканд',
        address: 'ул. Регистан, 12'
      },
      deliveryMethod: 'pickup',
      paymentMethod: 'card',
      deliveryCost: 0,
      total: 12999000,
      status: 'processing',
      createdAt: new Date(Date.now() - 43200000).toISOString() // 12 часов назад
    },
    {
      id: 1003,
      items: [
        {
          id: 4,
          name: 'Планшет Samsung Galaxy Tab S9',
          price: 8999000,
          quantity: 2,
          image: 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Tablet'
        }
      ],
      userInfo: {
        name: 'Сергей Сидоров',
        phone: '+998903456789',
        city: 'Ташкент',
        address: 'ул. Амира Темура, 78'
      },
      deliveryMethod: 'delivery',
      paymentMethod: 'click',
      deliveryCost: 20000,
      total: 17998000,
      status: 'delivered',
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 дня назад
    }
  ];
  
  // Сохраняем заказы
  localStorage.setItem('orders', JSON.stringify(testOrders));
  
  // Устанавливаем счетчик доставок (3 уже использовано)
  localStorage.setItem('deliveryCount', '3');
  
  // Авторизуем админа
  localStorage.setItem('adminAuth', 'true');
  
  console.log('✅ Тестовые данные успешно созданы!');
  console.log('📦 Заказы: 3 тестовых заказа');
  console.log('🚚 Счетчик доставок: 3 (следующая доставка будет платной)');
  console.log('🔑 Админ авторизован');
  console.log('\nДля входа в админ-панель:');
  console.log('1. Нажмите на иконку профиля в шапке');
  console.log('2. Выберите "Админ-панель"');
  console.log('3. Логин: admin, Пароль: admin123');
}

// Проверяем, находимся ли в браузере
if (typeof window !== 'undefined') {
  initTestData();
} else {
  console.log('Запустите этот скрипт в консоли браузера на странице приложения');
}