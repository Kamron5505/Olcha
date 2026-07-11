import { Link } from 'react-router-dom';

export default function PromoCard({ promo }) {
  return (
    <Link
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
        <h3 className="font-bold text-lg leading-tight">{promo.name || promo.title}</h3>
        {promo.discount && (
          <span className="inline-block mt-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{promo.discount}%
          </span>
        )}
      </div>
    </Link>
  );
}
