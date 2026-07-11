// Mock API для админ-панели
// В реальном приложении заменить на реальные запросы к серверу

const API_BASE = '/api/admin';
const STORAGE_KEY = 'admin_data';

// Инициализация тестовых данных
const initMockData = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const mockData = {
      users: [
        { id: 1, name: 'Админ', email: 'admin@olcha.uz', role: 'admin', createdAt: '2024-01-01' },
        { id: 2, name: 'Менеджер', email: 'manager@olcha.uz', role: 'manager', createdAt: '2024-01-02' },
        { id: 3, name: 'Иван Иванов', email: 'ivan@example.com', role: 'user', createdAt: '2024-01-03' },
        { id: 4, name: 'Анна Петрова', email: 'anna@example.com', role: 'user', createdAt: '2024-01-04' },
      ],
      products: [
        { id: 1, name: 'iPhone 15 Pro', price: 14999000, category: 'Смартфоны', stock: 15, status: 'active' },
        { id: 2, name: 'Samsung Galaxy S24', price: 12999000, category: 'Смартфоны', stock: 8, status: 'active' },
        { id: 3, name: 'MacBook Air M2', price: 17999000, category: 'Ноутбуки', stock: 5, status: 'active' },
        { id: 4, name: 'Sony PlayStation 5', price: 8999000, category: 'Игровые консоли', stock: 0, status: 'out_of_stock' },
      ],
      categories: [
        { id: 1, name: 'Смартфоны', slug: 'smartphones', productCount: 45 },
        { id: 2, name: 'Ноутбуки', slug: 'laptops', productCount: 32 },
        { id: 3, name: 'Телевизоры', slug: 'tvs', productCount: 28 },
        { id: 4, name: 'Бытовая техника', slug: 'appliances', productCount: 67 },
      ],
      orders: [
        { id: 1001, customer: 'Иван Иванов', total: 17998000, status: 'pending', date: '2024-03-25' },
        { id: 1002, customer: 'Анна Петрова', total: 12999000, status: 'processing', date: '2024-03-24' },
        { id: 1003, customer: 'Сергей Сидоров', total: 8999000, status: 'delivered', date: '2024-03-23' },
        { id: 1004, customer: 'Мария Ковалева', total: 24999000, status: 'shipped', date: '2024-03-22' },
      ],
      settings: {
        siteName: 'Olcha.uz',
        currency: 'UZS',
        deliveryCost: 20000,
        freeDeliveryThreshold: 3,
        maintenanceMode: false
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  }
};

// Получение данных из localStorage
const getData = () => {
  initMockData();
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

// Сохранение данных в localStorage
const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Имитация задержки API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Аутентификация
export const adminAuth = {
  login: async (email, password) => {
    await delay(500);
    
    // Тестовые учетные данные
    if (email === 'admin@olcha.uz' && password === 'admin123') {
      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify({
        id: 1,
        name: 'Администратор',
        email: email,
        role: 'admin'
      }));
      return { success: true, token, user: { id: 1, name: 'Администратор', email, role: 'admin' } };
    }
    
    return { success: false, error: 'Неверные учетные данные' };
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  checkAuth: () => {
    const token = localStorage.getItem('admin_token');
    const user = JSON.parse(localStorage.getItem('admin_user') || 'null');
    return { isAuthenticated: !!token, user };
  }
};

// Управление заказами
export const ordersApi = {
  getAll: async (filters = {}) => {
    await delay(300);
    const data = getData();
    let orders = data.orders;
    
    // Фильтрация
    if (filters.status && filters.status !== 'all') {
      orders = orders.filter(order => order.status === filters.status);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      orders = orders.filter(order => 
        order.customer.toLowerCase().includes(search) ||
        order.id.toString().includes(search)
      );
    }
    
    // Сортировка
    if (filters.sortBy) {
      orders.sort((a, b) => {
        if (filters.sortBy === 'date') {
          return new Date(b.date) - new Date(a.date);
        }
        if (filters.sortBy === 'total') {
          return b.total - a.total;
        }
        return 0;
      });
    }
    
    return { success: true, data: orders, total: orders.length };
  },

  getById: async (id) => {
    await delay(200);
    const data = getData();
    const order = data.orders.find(o => o.id === parseInt(id));
    
    if (!order) {
      return { success: false, error: 'Заказ не найден' };
    }
    
    // Детали заказа
    const orderDetails = {
      ...order,
      items: [
        { id: 1, name: 'iPhone 15 Pro', price: 14999000, quantity: 1, total: 14999000 },
        { id: 2, name: 'Чехол для iPhone', price: 299000, quantity: 2, total: 598000 }
      ],
      shipping: {
        method: 'delivery',
        address: 'ул. Навои, 45, Ташкент',
        cost: 20000
      },
      payment: {
        method: 'cash',
        status: 'pending'
      },
      customer: {
        name: order.customer,
        phone: '+998901234567',
        email: 'customer@example.com'
      }
    };
    
    return { success: true, data: orderDetails };
  },

  updateStatus: async (id, status) => {
    await delay(300);
    const data = getData();
    const orderIndex = data.orders.findIndex(o => o.id === parseInt(id));
    
    if (orderIndex === -1) {
      return { success: false, error: 'Заказ не найден' };
    }
    
    data.orders[orderIndex].status = status;
    saveData(data);
    
    return { success: true, data: data.orders[orderIndex] };
  },

  delete: async (id) => {
    await delay(300);
    const data = getData();
    const initialLength = data.orders.length;
    data.orders = data.orders.filter(o => o.id !== parseInt(id));
    
    if (data.orders.length === initialLength) {
      return { success: false, error: 'Заказ не найден' };
    }
    
    saveData(data);
    return { success: true };
  }
};

// Управление товарами
export const productsApi = {
  getAll: async (filters = {}) => {
    await delay(300);
    const data = getData();
    let products = data.products;
    
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters.status) {
      products = products.filter(p => p.status === filters.status);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.id.toString().includes(search)
      );
    }
    
    return { success: true, data: products, total: products.length };
  },

  getById: async (id) => {
    await delay(200);
    const data = getData();
    const product = data.products.find(p => p.id === parseInt(id));
    
    if (!product) {
      return { success: false, error: 'Товар не найден' };
    }
    
    const productDetails = {
      ...product,
      description: 'Подробное описание товара с характеристиками и преимуществами.',
      images: [
        'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=Product+Main',
        'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=Product+Side',
        'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=Product+Back'
      ],
      specifications: [
        { name: 'Бренд', value: product.name.split(' ')[0] },
        { name: 'Модель', value: product.name },
        { name: 'Цвет', value: 'Черный' },
        { name: 'Гарантия', value: '12 месяцев' }
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-03-01'
    };
    
    return { success: true, data: productDetails };
  },

  create: async (productData) => {
    await delay(400);
    const data = getData();
    const newId = Math.max(...data.products.map(p => p.id)) + 1;
    
    const newProduct = {
      id: newId,
      ...productData,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    
    data.products.push(newProduct);
    saveData(data);
    
    return { success: true, data: newProduct };
  },

  update: async (id, productData) => {
    await delay(400);
    const data = getData();
    const productIndex = data.products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return { success: false, error: 'Товар не найден' };
    }
    
    data.products[productIndex] = {
      ...data.products[productIndex],
      ...productData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    saveData(data);
    return { success: true, data: data.products[productIndex] };
  },

  delete: async (id) => {
    await delay(300);
    const data = getData();
    const initialLength = data.products.length;
    data.products = data.products.filter(p => p.id !== parseInt(id));
    
    if (data.products.length === initialLength) {
      return { success: false, error: 'Товар не найден' };
    }
    
    saveData(data);
    return { success: true };
  }
};

// Управление категориями
export const categoriesApi = {
  getAll: async () => {
    await delay(200);
    const data = getData();
    return { success: true, data: data.categories };
  },

  create: async (categoryData) => {
    await delay(300);
    const data = getData();
    const newId = Math.max(...data.categories.map(c => c.id)) + 1;
    
    const newCategory = {
      id: newId,
      ...categoryData,
      productCount: 0
    };
    
    data.categories.push(newCategory);
    saveData(data);
    
    return { success: true, data: newCategory };
  },

  update: async (id, categoryData) => {
    await delay(300);
    const data = getData();
    const categoryIndex = data.categories.findIndex(c => c.id === parseInt(id));
    
    if (categoryIndex === -1) {
      return { success: false, error: 'Категория не найдена' };
    }
    
    data.categories[categoryIndex] = {
      ...data.categories[categoryIndex],
      ...categoryData
    };
    
    saveData(data);
    return { success: true, data: data.categories[categoryIndex] };
  },

  delete: async (id) => {
    await delay(300);
    const data = getData();
    const initialLength = data.categories.length;
    data.categories = data.categories.filter(c => c.id !== parseInt(id));
    
    if (data.categories.length === initialLength) {
      return { success: false, error: 'Категория не найдена' };
    }
    
    saveData(data);
    return { success: true };
  }
};

// Управление пользователями
export const usersApi = {
  getAll: async (filters = {}) => {
    await delay(300);
    const data = getData();
    let users = data.users;
    
    if (filters.role && filters.role !== 'all') {
      users = users.filter(u => u.role === filters.role);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      );
    }
    
    return { success: true, data: users, total: users.length };
  },

  updateRole: async (id, role) => {
    await delay(300);
    const data = getData();
    const userIndex = data.users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) {
      return { success: false, error: 'Пользователь не найден' };
    }
    
    data.users[userIndex].role = role;
    saveData(data);
    
    return { success: true, data: data.users[userIndex] };
  }
};

// Настройки
export const settingsApi = {
  get: async () => {
    await delay(200);
    const data = getData();
    return { success: true, data: data.settings };
  },

  update: async (settings) => {
    await delay(400);
    const data = getData();
    data.settings = { ...data.settings, ...settings };
    saveData(data);
    
    return { success: true, data: data.settings };
  }
};

// Статистика
export const statsApi = {
  getDashboard: async () => {
    await delay(400);
    const data = getData();
    
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return {
      success: true,
      data: {
        totalOrders: data.orders.length,
        totalRevenue: data.orders.reduce((sum, order) => sum + order.total, 0),
        totalProducts: data.products.length,
        totalUsers: data.users.length,
        recentOrders: data.orders.slice(0, 5),
        lowStockProducts: data.products.filter(p => p.stock < 10),
        salesChart: [
          { date: '2024-03-18', orders: 12, revenue: 120000000 },
          { date: '2024-03-19', orders: 15, revenue: 150000000 },
          { date: '2024-03-20', orders: 18, revenue: 180000000 },
          { date: '2024-03-21', orders: 14, revenue: 140000000 },
          { date: '2024-03-22', orders: 20, revenue: 200000000 },
          { date: '2024-03-23', orders: 16, revenue: 160000000 },
          { date: today, orders: 22, revenue: 220000000 }
        ]
      }
    };
  }
};

// Экспорт всех API
export default {
  auth: adminAuth,
  orders: ordersApi,
  products: productsApi,
  categories: categoriesApi,
  users: usersApi,
  settings: settingsApi,
  stats: statsApi
};