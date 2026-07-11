import { useState, useEffect } from 'react';
import { getProductById, normalizeProduct } from '../services/api/olchaApi';
import { useCartContext } from '../context/CartContext';
import { useLang } from '../context/LangContext';

function formatPrice(price) {
  if (!price) return '0';
  return Number(price).toLocaleString('ru-RU');
}

export default function ProductModal({ productId, isOpen, onClose }) {
  const { addItem, isInCart } = useCartContext();
  const { t } = useLang();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const inCart = product ? isInCart(product.id) : false;

  useEffect(() => {
    if (isOpen && productId) {
      setLoading(true);
      getProductById(productId)
        .then((r) => {
          const raw = r.data?.data?.product || r.data?.data || r.data;
          const p = normalizeProduct(raw);
          setProduct(p);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setProduct(null);
      setActiveImage(0);
      setQty(1);
      setActiveTab('description');
    }
  }, [isOpen, productId]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (product) {
      addItem(product, qty);
    }
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const images = product?.images?.length
    ? product.images.map((img) => (typeof img === 'string' ? img : img.image))
    : product?.image
    ? [product.image]
    : [];

  const price = product?.price || product?.min_price || 0;
  const oldPrice = product?.old_price || null;
  const discount = oldPrice && price && oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;

  const specs = product?.attributes || product?.specifications || product?.chars || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Быстрый просмотр</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : product ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Images */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl aspect-square flex items-center justify-center overflow-hidden">
                  {images.length > 0 ? (
                    <img
                      src={images[activeImage]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x500/f3f4f6/9ca3af?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="text-gray-300">
                      <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-colors ${
                          i === activeImage ? 'border-red-500' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { e.target.src = '/placeholder.png'; }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right side - Info */}
              <div className="space-y-6">
                <div>
                  {product.brand && (
                    <p className="text-sm text-blue-600 font-medium mb-1">
                      {product.brand?.name || product.brand}
                    </p>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2">{product.name}</h3>
                  
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {product.rating} ({product.reviews_count || 0} отзывов)
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(price)} {t('sum')}</span>
                    {discount && discount > 0 && (
                      <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  {oldPrice && (
                    <p className="text-sm text-gray-400 line-through">{formatPrice(oldPrice)} {t('sum')}</p>
                  )}
                  
                  {product.installment_price && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-medium">Рассрочка 0%</p>
                      <p className="text-sm font-bold text-blue-800">
                        {formatPrice(product.installment_price)} {t('sum')}/мес
                      </p>
                    </div>
                  )}
                </div>

                {/* Stock status */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      product.in_stock !== false ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      product.in_stock !== false ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {product.in_stock !== false ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Количество:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick specs */}
                {specs.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Основные характеристики</h4>
                    <div className="space-y-1">
                      {specs.slice(0, 3).map((spec, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-500">{spec.name || spec.key}</span>
                          <span className="text-gray-800 font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description preview */}
                {product.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Описание</h4>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Tabs */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex gap-4 mb-4">
                    {[
                      { key: 'description', label: 'Описание' },
                      { key: 'specs', label: 'Характеристики' },
                      { key: 'reviews', label: `Отзывы (${product.reviews_count || 0})` },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`text-sm font-medium transition-colors ${
                          activeTab === tab.key
                            ? 'text-red-600 border-b-2 border-red-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-40 overflow-y-auto">
                    {activeTab === 'description' && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {product.description || 'Описание отсутствует'}
                      </p>
                    )}
                    
                    {activeTab === 'specs' && (
                      <div className="space-y-2">
                        {specs.slice(0, 5).map((spec, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-500">{spec.name || spec.key}</span>
                            <span className="text-gray-800 font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {activeTab === 'reviews' && (
                      <p className="text-sm text-gray-400 text-center py-4">
                        Отзывов пока нет
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Товар не найден</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Закрыть
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product || product.in_stock === false}
                className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                  inCart
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {inCart ? 'В корзине' : 'Добавить в корзину'}
              </button>
              
              {product && (
                <a
                  href={`/product/${product.id}`}
                  className="px-6 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors"
                >
                  Подробнее
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}