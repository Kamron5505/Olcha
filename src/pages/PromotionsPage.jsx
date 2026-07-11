import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPromotions } from '../services/api/olchaApi';
import SectionTitle from '../components/SectionTitle';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPromotions()
      .then((r) => {
        const d = r.data;
        setPromotions(d.results || d || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">Акции</span>
      </nav>

      <SectionTitle title="Акции и скидки" />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] skeleton-shimmer rounded-xl" />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Акций пока нет</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {promotions.map((promo) => (
            <Link
              key={promo.id}
              to={`/promotions/${promo.id}`}
              className="block rounded-xl overflow-hidden relative group aspect-[4/3] bg-gradient-to-br from-red-600 to-red-800"
            >
              {promo.image && (
                <img
                  src={promo.image}
                  alt={promo.name || promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg">{promo.name || promo.title}</h3>
                {promo.end_date && (
                  <p className="text-sm opacity-80">До {new Date(promo.end_date).toLocaleDateString('ru-RU')}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
