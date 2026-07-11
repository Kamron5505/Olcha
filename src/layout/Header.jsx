import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useSearch } from '../hooks/useSearch';
import { getCategories, normalizeCategory } from '../services/api/olchaApi';
import CategoryMenu from '../components/CategoryMenu';

// Настоящий логотип olcha — красный текст на прозрачном фоне
function OlchaLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="0" y="50"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="58"
        fill="#CC0000"
        letterSpacing="-2"
      >
        olcha
      </text>
    </svg>
  );
}

export default function Header() {
  const { totalItems } = useCartContext();
  const { user, logout } = useAuth();
  const { t, lang, changeLang, LANGUAGES } = useLang();
  const { query, results, loading, search, clear } = useSearch();
  const [categories, setCategories] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then((r) => {
        const d = r.data;
        // API v2: { data: { categories: [...] } }
        const raw = d?.data?.categories || d?.results || d || [];
        const list = Array.isArray(raw) ? raw : Object.values(raw);
        setCategories(list.map(normalizeCategory));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
      setShowSearch(false);
      clear();
    }
  }

  function handleResultClick(id) {
    navigate(`/product/${id}`);
    setShowSearch(false);
    clear();
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-[#1d1d1d] text-white text-xs py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <a href="tel:+998712000000" className="hover:text-red-400 transition-colors">
              📞 {t('topbar_phone')}
            </a>
            <span className="hidden sm:inline text-gray-400">{t('topbar_hours')}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <Link to="/about" className="hover:text-white transition-colors hidden sm:inline">{t('about')}</Link>
            <Link to="/delivery" className="hover:text-white transition-colors hidden sm:inline">{t('delivery')}</Link>
            <Link to="/contacts" className="hover:text-white transition-colors hidden sm:inline">{t('contacts')}</Link>

            {/* Language switcher */}
            <div className="flex items-center gap-1 border-l border-gray-600 pl-4">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    lang === l.code
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <OlchaLogo className="h-9 w-auto" />
          </Link>

          {/* Catalog button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {t('catalog')}
          </button>

          {/* Search */}
          <div className="flex-1 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                type="text"
                value={query}
                onChange={(e) => { search(e.target.value); setShowSearch(true); }}
                onFocus={() => setShowSearch(true)}
                placeholder={t('search_placeholder')}
                className="w-full border border-gray-200 rounded-l-lg px-4 py-2.5 text-sm outline-none focus:border-red-400 transition-colors"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-r-lg transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Search dropdown */}
            {showSearch && query && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                {loading && (
                  <div className="p-4 text-center text-gray-500 text-sm">Поиск...</div>
                )}
                {!loading && results.length === 0 && query && (
                  <div className="p-4 text-center text-gray-500 text-sm">Ничего не найдено</div>
                )}
                {results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleResultClick(p.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                  >
                    <img
                      src={p.image || p.images?.[0]?.image || '/placeholder.png'}
                      alt={p.name}
                      className="w-10 h-10 object-contain rounded"
                      onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-sm text-red-600 font-semibold">
                        {formatPrice(p.price || p.min_price)} сум
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/favorites" className="hidden sm:flex flex-col items-center p-2 hover:text-red-600 transition-colors text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs mt-0.5">{t('favorites')}</span>
            </Link>

            <Link to="/cart" className="flex flex-col items-center p-2 hover:text-red-600 transition-colors text-gray-600 relative">
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs mt-0.5">{t('cart')}</span>
            </Link>

            {user ? (
              <div className="relative group hidden sm:block">
                <button className="flex flex-col items-center p-2 hover:text-red-600 transition-colors text-gray-600">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-xs mt-0.5 max-w-[60px] truncate">{user.name?.split(' ')[0]}</span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Профиль
                  </Link>
                  <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    Мои заказы
                  </Link>
                  <Link to="/favorites" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    Избранное
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Админ-панель
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Выйти
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex flex-col items-center p-2 hover:text-red-600 transition-colors text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              <span className="text-xs mt-0.5">{t('login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Category nav */}
      <nav className="bg-white border-b border-gray-100 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
            {categories.slice(0, 10).map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.id}`}
                className="flex-shrink-0 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu button */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {t('all_categories_title')}
        </button>
      </div>

      {/* Category mega menu */}
      {menuOpen && (
        <CategoryMenu
          categories={categories}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}

function formatPrice(price) {
  if (!price) return '0';
  return Number(price).toLocaleString('ru-RU');
}
