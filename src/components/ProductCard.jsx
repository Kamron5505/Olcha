import { Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { useState } from 'react';
import ProductModal from './ProductModal';

function formatPrice(price) {
  if (price === undefined || price === null) return '0';

  // Пробуем преобразовать в число разными способами
  let num;
  if (typeof price === 'string') {
    // Убираем пробелы и нечисловые символы
    const cleaned = price.replace(/\s/g, '').replace(/[^\d.,]/g, '');
    num = parseFloat(cleaned.replace(',', '.'));
  } else {
    num = Number(price);
  }

  if (isNaN(num)) return '0';

  return num.toLocaleString('ru-RU');
}

export default function ProductCard({ product }) {
  const { addItem, isInCart } = useCartContext();
  const { t } = useLang();
  const inCart = isInCart(product.id);
  const [showModal, setShowModal] = useState(false);

  const image =
    product.image ||
    product.images?.[0]?.image ||
    product.images?.[0] ||
    null;

  const price = product.price || product.min_price || 0;
  const oldPrice = product.old_price || product.max_price || null;
  const discount =
    oldPrice && price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  return (
    <>
      <div className="product-card bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="relative overflow-hidden group">
          <Link to={`/product/${product.id}`} className="block">
            <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
              <img
                src={image || `https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=${encodeURIComponent(product.name || 'Товар')}`}
                alt={product.name || 'Товар'}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image`;
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
            </div>
          </Link>

          {/* Badges — stacked top-left so they never overlap */}
          <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5 z-10">
            {discount && discount > 0 && (
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm tabular-nums">
                −{discount}%
              </span>
            )}
            {product.is_new && (
              <span className="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                NEW
              </span>
            )}
          </div>

          {/* Quick view — subtle icon, reveals on hover */}
          <button
            onClick={() => setShowModal(true)}
            aria-label="Быстрый просмотр"
            title="Быстрый просмотр"
            className="absolute top-2.5 right-2.5 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur text-gray-600 hover:text-red-600 rounded-full shadow-sm ring-1 ring-black/5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 active:scale-95 z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>

        <div className="p-3 flex flex-col flex-1">
          <Link to={`/product/${product.id}`} className="flex-1">
            <p className="text-sm text-gray-800 line-clamp-2 hover:text-red-600 transition-colors leading-snug mb-2">
              {product.name || 'Без названия'}
            </p>
          </Link>

          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-base font-extrabold text-gray-900 tabular-nums">
                {formatPrice(price)} {t('sum')}
              </span>
              {oldPrice && oldPrice > price && (
                <span className="text-xs text-gray-400 line-through tabular-nums">
                  {formatPrice(oldPrice)}
                </span>
              )}
            </div>

            {product.installment_price && (
              <p className="text-xs text-blue-600 mb-2">
                {t('installment_price')}: {formatPrice(product.installment_price)} {t('per_month')}
              </p>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                inCart
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
              }`}
            >
              {inCart ? (
                <span className="flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('in_cart')}
                </span>
              ) : t('add_to_cart')}
            </button>
          </div>
        </div>
      </div>
      
      {showModal && (
        <ProductModal
          productId={product.id}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}