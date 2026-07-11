import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-8xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Страница не найдена</h2>
      <p className="text-gray-500 mb-8">Запрашиваемая страница не существует или была удалена</p>
      <Link
        to="/"
        className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
      >
        На главную
      </Link>
    </div>
  );
}
