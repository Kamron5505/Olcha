import { Link } from 'react-router-dom';

export default function SectionTitle({ title, link, linkText = 'Все товары' }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <span className="w-1 h-6 bg-red-600 rounded-full inline-block" />
        {title}
      </h2>
      {link && (
        <Link
          to={link}
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
        >
          {linkText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
