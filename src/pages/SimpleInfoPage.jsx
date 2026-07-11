import { Link, useLocation } from 'react-router-dom';

const PAGES = {
  '/jobs': {
    title: 'Вакансии',
    icon: '💼',
    content: 'Мы всегда в поиске талантливых людей! Отправьте своё резюме на hr@olcha.uz',
    items: ['Менеджер по продажам', 'Курьер', 'Оператор колл-центра', 'Разработчик', 'Маркетолог'],
  },
  '/partners': {
    title: 'Партнёрам',
    icon: '🤝',
    content: 'Хотите продавать на olcha.uz? Станьте нашим партнёром и получите доступ к миллионам покупателей.',
    items: ['Простая регистрация', 'Низкая комиссия', 'Быстрые выплаты', 'Поддержка 24/7'],
  },
  '/blog': {
    title: 'Блог',
    icon: '📰',
    content: 'Полезные статьи, обзоры техники и советы по выбору товаров.',
    items: ['Обзоры смартфонов', 'Советы по выбору ТВ', 'Топ гаджетов 2025', 'Как сэкономить'],
  },
  '/privacy': {
    title: 'Политика конфиденциальности',
    icon: '🔒',
    content: 'Мы серьёзно относимся к защите ваших персональных данных. Ваши данные не передаются третьим лицам.',
    items: ['Сбор данных', 'Использование данных', 'Защита данных', 'Ваши права'],
  },
  '/terms': {
    title: 'Условия использования',
    icon: '📄',
    content: 'Используя сайт olcha.uz, вы соглашаетесь с нашими условиями использования.',
    items: ['Правила покупки', 'Ответственность', 'Интеллектуальная собственность', 'Изменения условий'],
  },
  '/notifications': {
    title: 'Уведомления',
    icon: '🔔',
    content: 'У вас пока нет новых уведомлений.',
    items: [],
  },
  '/orders': {
    title: 'Мои заказы',
    icon: '📦',
    content: 'Войдите в аккаунт, чтобы увидеть историю заказов.',
    items: [],
  },
  '/addresses': {
    title: 'Адреса доставки',
    icon: '📍',
    content: 'Войдите в аккаунт, чтобы управлять адресами доставки.',
    items: [],
  },
  '/payment-methods': {
    title: 'Способы оплаты',
    icon: '💳',
    content: 'Войдите в аккаунт, чтобы управлять способами оплаты.',
    items: [],
  },
  '/settings': {
    title: 'Настройки',
    icon: '⚙️',
    content: 'Войдите в аккаунт, чтобы изменить настройки профиля.',
    items: [],
  },
  '/forgot-password': {
    title: 'Восстановление пароля',
    icon: '🔑',
    content: 'Введите номер телефона, привязанный к аккаунту. Мы отправим код подтверждения.',
    items: [],
  },
};

export default function SimpleInfoPage() {
  const { pathname } = useLocation();
  const page = PAGES[pathname] || {
    title: 'Страница',
    icon: '📄',
    content: 'Страница в разработке.',
    items: [],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">{page.title}</span>
      </nav>

      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-6">{page.icon}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{page.title}</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">{page.content}</p>

        {page.items.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-left mb-8">
            <ul className="space-y-3">
              {page.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors">
            На главную
          </Link>
          <Link to="/contacts" className="border border-gray-200 hover:border-red-400 text-gray-600 hover:text-red-600 px-6 py-2.5 rounded-xl font-semibold transition-colors">
            Связаться с нами
          </Link>
        </div>
      </div>
    </div>
  );
}
