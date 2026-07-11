import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 justify-center">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">Избранное</span>
      </nav>
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Список избранного пуст</h2>
        <p className="text-gray-500 mb-8">Добавляйте понравившиеся товары в избранное, нажав на сердечко на карточке товара</p>
        <Link
          to="/catalog"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          Перейти в каталог
        </Link>
      </div>
    </div>
  );
}
