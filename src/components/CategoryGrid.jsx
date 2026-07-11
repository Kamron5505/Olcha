import { Link } from 'react-router-dom';

const CATEGORY_COLORS = [
  'bg-blue-50 hover:bg-blue-100',
  'bg-red-50 hover:bg-red-100',
  'bg-green-50 hover:bg-green-100',
  'bg-yellow-50 hover:bg-yellow-100',
  'bg-purple-50 hover:bg-purple-100',
  'bg-pink-50 hover:bg-pink-100',
  'bg-indigo-50 hover:bg-indigo-100',
  'bg-orange-50 hover:bg-orange-100',
];

export default function CategoryGrid({ categories, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-xl skeleton-shimmer" />
            <div className="h-3 w-16 skeleton-shimmer rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
      {categories.slice(0, 16).map((cat, i) => (
        <Link
          key={cat.id}
          to={`/catalog?category=${cat.id}`}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all group ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            {cat.icon ? (
              <img
                src={cat.icon}
                alt={cat.name}
                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
          </div>
          <span className="text-xs text-center text-gray-700 font-medium leading-tight line-clamp-2">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
