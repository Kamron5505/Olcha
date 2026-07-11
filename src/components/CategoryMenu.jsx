import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function CategoryMenu({ categories, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}>
      <div
        ref={ref}
        className="absolute top-0 left-0 w-72 bg-white h-full shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-red-600 text-white">
          <span className="font-semibold">Каталог товаров</span>
          <button onClick={onClose} className="hover:bg-red-700 rounded p-1 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="py-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/catalog?category=${cat.id}`}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 hover:text-red-600 transition-colors group"
              >
                {cat.icon && (
                  <img
                    src={cat.icon}
                    alt=""
                    className="w-6 h-6 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <span className="text-sm text-gray-700 group-hover:text-red-600 flex-1">{cat.name}</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
