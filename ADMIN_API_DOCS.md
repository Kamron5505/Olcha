# Документация API админ-панели Olcha

## Общая информация

Админ-панель использует Mock API для демонстрации. Все данные хранятся в `localStorage` под ключом `admin_data`.

## Аутентификация

### Вход в систему
```javascript
POST /api/admin/auth/login
```
**Параметры:**
- `email` (string) - Email администратора
- `password` (string) - Пароль

**Тестовые учетные данные:**
- Email: `admin@olcha.uz`
- Пароль: `admin123`

**Ответ:**
```json
{
  "success": true,
  "token": "base64_token",
  "user": {
    "id": 1,
    "name": "Администратор",
    "email": "admin@olcha.uz",
    "role": "admin"
  }
}
```

### Проверка авторизации
```javascript
GET /api/admin/auth/check
```
**Ответ:**
```json
{
  "isAuthenticated": true,
  "user": {
    "id": 1,
    "name": "Администратор",
    "email": "admin@olcha.uz",
    "role": "admin"
  }
}
```

### Выход из системы
```javascript
POST /api/admin/auth/logout
```

## Управление заказами

### Получение списка заказов
```javascript
GET /api/admin/orders
```
**Параметры фильтрации:**
- `status` (string) - Статус заказа (all, pending, processing, shipped, delivered, cancelled)
- `search` (string) - Поиск по ID или имени клиента
- `sortBy` (string) - Сортировка (date, total)

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1001,
      "customer": "Иван Иванов",
      "total": 17998000,
      "status": "pending",
      "date": "2024-03-25"
    }
  ],
  "total": 1
}
```

### Получение деталей заказа
```javascript
GET /api/admin/orders/:id
```
**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": 1001,
    "customer": "Иван Иванов",
    "total": 17998000,
    "status": "pending",
    "date": "2024-03-25",
    "items": [
      {
        "id": 1,
        "name": "iPhone 15 Pro",
        "price": 14999000,
        "quantity": 1,
        "total": 14999000
      }
    ],
    "shipping": {
      "method": "delivery",
      "address": "ул. Навои, 45, Ташкент",
      "cost": 20000
    },
    "payment": {
      "method": "cash",
      "status": "pending"
    },
    "customer": {
      "name": "Иван Иванов",
      "phone": "+998901234567",
      "email": "customer@example.com"
    }
  }
}
```

### Обновление статуса заказа
```javascript
PUT /api/admin/orders/:id/status
```
**Параметры:**
- `status` (string) - Новый статус (pending, processing, shipped, delivered, cancelled)

**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": 1001,
    "status": "processing"
  }
}
```

### Удаление заказа
```javascript
DELETE /api/admin/orders/:id
```

## Управление товарами

### Получение списка товаров
```javascript
GET /api/admin/products
```
**Параметры фильтрации:**
- `category` (string) - Категория товара
- `status` (string) - Статус (all, active, out_of_stock, draft)
- `search` (string) - Поиск по названию или ID

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "price": 14999000,
      "category": "Смартфоны",
      "stock": 15,
      "status": "active"
    }
  ],
  "total": 1
}
```

### Создание товара
```javascript
POST /api/admin/products
```
**Параметры:**
- `name` (string) - Название товара
- `price` (number) - Цена
- `category` (string) - Категория
- `stock` (number) - Количество на складе
- `status` (string) - Статус (active, out_of_stock, draft)
- `description` (string) - Описание (опционально)

**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Новый товар",
    "price": 1000000,
    "category": "Аксессуары",
    "stock": 10,
    "status": "active",
    "createdAt": "2024-03-25"
  }
}
```

### Обновление товара
```javascript
PUT /api/admin/products/:id
```
**Параметры:** (те же, что и при создании)

### Удаление товара
```javascript
DELETE /api/admin/products/:id
```

## Управление категориями

### Получение списка категорий
```javascript
GET /api/admin/categories
```
**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Смартфоны",
      "slug": "smartphones",
      "productCount": 45
    }
  ]
}
```

### Создание категории
```javascript
POST /api/admin/categories
```
**Параметры:**
- `name` (string) - Название категории
- `slug` (string) - URL-слаг (опционально)

### Обновление категории
```javascript
PUT /api/admin/categories/:id
```

### Удаление категории
```javascript
DELETE /api/admin/categories/:id
```

## Управление пользователями

### Получение списка пользователей
```javascript
GET /api/admin/users
```
**Параметры фильтрации:**
- `role` (string) - Роль пользователя (all, admin, manager, user)
- `search` (string) - Поиск по имени или email

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Админ",
      "email": "admin@olcha.uz",
      "role": "admin",
      "createdAt": "2024-01-01"
    }
  ],
  "total": 1
}
```

### Обновление роли пользователя
```javascript
PUT /api/admin/users/:id/role
```
**Параметры:**
- `role` (string) - Новая роль (admin, manager, user)

## Настройки

### Получение настроек
```javascript
GET /api/admin/settings
```
**Ответ:**
```json
{
  "success": true,
  "data": {
    "siteName": "Olcha.uz",
    "currency": "UZS",
    "deliveryCost": 20000,
    "freeDeliveryThreshold": 3,
    "maintenanceMode": false
  }
}
```

### Обновление настроек
```javascript
PUT /api/admin/settings
```
**Параметры:** (любые поля из настроек)

## Статистика

### Получение статистики дашборда
```javascript
GET /api/admin/stats/dashboard
```
**Ответ:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 4,
    "totalRevenue": 64000000,
    "totalProducts": 4,
    "totalUsers": 4,
    "recentOrders": [...],
    "lowStockProducts": [...],
    "salesChart": [
      {
        "date": "2024-03-25",
        "orders": 22,
        "revenue": 220000000
      }
    ]
  }
}
```

## Коды статусов

- `pending` - Ожидает обработки
- `processing` - В обработке
- `shipped` - Отправлен
- `delivered` - Доставлен
- `cancelled` - Отменен

## Роли пользователей

- `admin` - Администратор (полный доступ)
- `manager` - Менеджер (управление заказами и товарами)
- `user` - Обычный пользователь

## Форматы данных

### Цены
Все цены указываются в сумах (UZS) без копеек.

### Даты
Формат: `YYYY-MM-DD`

### Статусы товаров
- `active` - Активен, доступен для покупки
- `out_of_stock` - Нет в наличии
- `draft` - Черновик, не отображается на сайте

## Ошибки

Все ошибки возвращаются в формате:
```json
{
  "success": false,
  "error": "Описание ошибки"
}
```

## Примеры использования

### JavaScript (React)
```javascript
import adminApi from './services/api/adminApi';

// Вход в систему
const login = async () => {
  const result = await adminApi.auth.login('admin@olcha.uz', 'admin123');
  if (result.success) {
    console.log('Вход выполнен:', result.user);
  }
};

// Получение заказов
const loadOrders = async () => {
  const result = await adminApi.orders.getAll({
    status: 'pending',
    sortBy: 'date'
  });
  if (result.success) {
    console.log('Заказы:', result.data);
  }
};

// Обновление статуса заказа
const updateOrderStatus = async (orderId) => {
  const result = await adminApi.orders.updateStatus(orderId, 'processing');
  if (result.success) {
    console.log('Статус обновлен:', result.data);
  }
};
```

## Миграция на реальное API

Для перехода на реальное API замените:

1. **Хранение данных:** localStorage → база данных
2. **Аутентификация:** Mock → JWT или сессии
3. **API endpoints:** Mock функции → реальные HTTP запросы
4. **Безопасность:** Добавьте валидацию, авторизацию, HTTPS

## Тестирование

Для тестирования используйте Postman или аналогичные инструменты:

1. Установите базовый URL: `http://localhost:5173/api/admin`
2. Добавьте заголовок авторизации после входа
3. Тестируйте endpoints согласно документации