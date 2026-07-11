import { Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { useState } from 'react';
import ProductModal from './ProductModal';
import ProductModalSimple from './ProductModalSimple';

function formatPrice(price) {
  console.log('formatPrice input:', price, 'type:', typeof price);
  
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
  
  if (isNaN(num)) {
    console.warn('Cannot parse price:', price);
    return '0';
  }
  
  return num.toLocaleString('ru-RU');
}

export default function ProductCard({ product }) {
  const { addItem, isInCart } = useCartContext();
  const { t } = useLang();
  const inCart = isInCart(product.id);
  const [showModal, setShowModal] = useState(false);

  // Отладка данных товара
  console.log('ProductCard data:', {
    id: product.id,
    name: product.name,
    price: product.price,
    min_price: product.min_price,
    image: product.image,
    images: product.images,
    hasModal: !!ProductModal
  });

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
      <div className="product-card bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="relative overflow-hidden group">
          <Link to={`/product/${product.id}`} className="block">
            <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
              <img
                src={image || `https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=${encodeURIComponent(product.name || 'Товар')}`}
                alt={product.name || 'Товар'}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.log('Image error for product:', product.id, 'src:', e.target.src);
                  e.target.src = `https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image`;
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
            </div>
          </Link>
          
          {/* Quick view button - УПРОЩЕННАЯ ВЕРСИЯ ДЛЯ ТЕСТА */}
          <button
            onClick={() => {
              console.log('Quick view clicked for product:', product.id);
              setShowModal(true);
            }}
            className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm z-10"
          >
            👁️ Быстрый просмотр
          </button>
          
          {discount && discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.is_new && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <Link to={`/product/${product.id}`} className="flex-1">
            <p className="text-sm text-gray-800 line-clamp-2 hover:text-red-600 transition-colors leading-snug mb-2">
              {product.name || 'Без названия'}
            </p>
          </Link>

          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-base font-bold text-gray-900">
                {formatPrice(price)} {t('sum')}
              </span>
              {oldPrice && oldPrice > price && (
                <span className="text-xs text-gray-400 line-through">
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
        <ProductModalSimple
          productId={product.id}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}