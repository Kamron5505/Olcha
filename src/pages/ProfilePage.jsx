import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MENU = [
  { icon: '📦', label: 'Мои заказы', href: '/orders', desc: 'История и статус заказов' },
  { icon: '❤️', label: 'Избранное', href: '/favorites', desc: 'Сохранённые товары' },
  { icon: '🔔', label: 'Уведомления', href: '/notifications', desc: 'Акции и новости' },
  { icon: '📍', label: 'Адреса доставки', href: '/addresses', desc: 'Управление адресами' },
  { icon: '💳', label: 'Способы оплаты', href: '/payment-methods', desc: 'Карты и счета' },
  { icon: '⚙️', label: 'Настройки', href: '/settings', desc: 'Личные данные и безопасность' },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">Личный кабинет</span>
      </nav>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* User card */}
        {user ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-100 flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">{user.name}</h2>
                {user.phone && (
                  <p className="text-sm text-gray-500">+998 {user.phone}</p>
                )}
                {user.email && (
                  <p className="text-sm text-gray-500">{user.email}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {user.city && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      📍 {user.city}
                    </span>
                  )}
                  {user.gender && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {user.gender === 'male' ? '👨 Мужской' : '👩 Женский'}
                    </span>
                  )}
                  {user.birthday && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      🎂 {new Date(user.birthday).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    ✓ {user.loginMethod === 'google' ? 'Google' : 'Телефон'}
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <Link
                to="/profile/edit"
                className="flex-shrink-0 flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Изменить
              </Link>
            </div>
          </div>
        ) : (
          /* Not logged in */
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Войдите в аккаунт</h2>
            <p className="text-gray-500 text-sm mb-6">Чтобы видеть заказы, избранное и управлять профилем</p>
            <div className="flex gap-3 justify-center">
              <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors">
                Войти
              </Link>
              <Link to="/login" className="border border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-600 px-6 py-2.5 rounded-xl font-semibold transition-colors">
                Регистрация
              </Link>
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {MENU.map((item, i) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${i < MENU.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Logout */}
        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 py-3.5 rounded-2xl transition-colors font-medium bg-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти из аккаунта
          </button>
        )}
      </div>
    </div>
  );
}
