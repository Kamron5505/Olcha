import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts, normalizeProduct } from '../services/api/olchaApi';
import { useCartContext } from '../context/CartContext';
import ProductGrid from '../components/ProductGrid';
import SectionTitle from '../components/SectionTitle';

function formatPrice(price) {
  if (!price) return '0';
  return Number(price).toLocaleString('ru-RU');
}

export default function ProductPage() {
  const { id } = useParams();
  const { addItem, isInCart } = useCartContext();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const inCart = product ? isInCart(product.id) : false;

  useEffect(() => {
    setLoading(true);
    setError(null);
    setActiveImage(0);
    setQty(1);

    getProductById(id)
      .then((r) => {
        // API v2: { data: { product: {...} } } or { data: {...} }
        const raw = r.data?.data?.product || r.data?.data || r.data;
        const p = normalizeProduct(raw);
        setProduct(p);
        const catId = raw.category?.id || raw.category;
        if (catId) {
          getProducts({ category: catId, page_size: 10 })
            .then((rr) => {
              const list = rr.data?.data?.products || rr.data?.results || [];
              const normalized = list.map(normalizeProduct).filter((x) => x.id !== p.id);
              setRelated(normalized.slice(0, 10));
            })
            .catch(() => {});
        }
      })
      .catch((err) => setError(err.message || 'Товар не найден'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ProductPageSkeleton />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link to="/catalog" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length
    ? product.images.map((img) => (typeof img === 'string' ? img : img.image))
    : product.image
    ? [product.image]
    : [];

  const price = product.price || product.min_price || 0;
  const oldPrice = product.old_price || null;
  const discount =
    oldPrice && price && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  const specs = product.attributes || product.specifications || product.chars || [];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-red-600 transition-colors">Каталог</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              to={`/catalog?category=${product.category?.id || product.category}`}
              className="hover:text-red-600 transition-colors"
            >
              {product.category?.name || 'Категория'}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-800 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_300px] gap-6 mb-10">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 aspect-square flex items-center justify-center overflow-hidden">
            {images.length > 0 ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500/f3f4f6/9ca3af?text=No+Image';
                }}
              />
            ) : (
              <div className="text-gray-300 text-center">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">Нет изображения</p>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
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

        {/* Info */}
        <div className="space-y-4">
          {product.brand && (
            <p className="text-sm text-blue-600 font-medium">
              {product.brand?.name || product.brand}
            </p>
          )}
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{product.name}</h1>

          {product.rating && (
            <div className="flex items-center gap-2">
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

          {specs.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <table className="w-full text-sm">
                <tbody>
                  {specs.slice(0, 5).map((spec, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="py-1.5 text-gray-500 pr-4 w-1/2">{spec.name || spec.key}</td>
                      <td className="py-1.5 text-gray-800 font-medium">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {product.description}
            </p>
          )}
        </div>

        {/* Buy block */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 h-fit space-y-4 lg:sticky lg:top-24">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(price)} сум</span>
              {discount && discount > 0 && (
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>
            {oldPrice && (
              <p className="text-sm text-gray-400 line-through mt-0.5">{formatPrice(oldPrice)} сум</p>
            )}
          </div>

          {product.installment_price && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-medium">Рассрочка 0%</p>
              <p className="text-sm font-bold text-blue-800">
                {formatPrice(product.installment_price)} сум/мес
              </p>
            </div>
          )}

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

          <button
            onClick={() => addItem(product, qty)}
            disabled={product.in_stock === false}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
              inCart
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {inCart ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Добавлено в корзину
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                В корзину
              </span>
            )}
          </button>

          {inCart && (
            <Link
              to="/cart"
              className="block w-full py-3 rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold text-sm text-center transition-colors"
            >
              Перейти в корзину
            </Link>
          )}

          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Доставка по Ташкенту: 1-3 дня
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              По регионам: 3-7 дней
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 mb-10">
        <div className="flex border-b border-gray-100">
          {[
            { key: 'description', label: 'Описание' },
            { key: 'specs', label: 'Характеристики' },
            { key: 'reviews', label: `Отзывы (${product.reviews_count || 0})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'description' && (
            <div className="text-gray-700 leading-relaxed text-sm">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="text-gray-400">Описание отсутствует</p>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              {specs.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2.5 px-4 text-gray-500 w-1/2">{spec.name || spec.key}</td>
                        <td className="py-2.5 px-4 text-gray-800 font-medium">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">Характеристики не указаны</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Отзывов пока нет</p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <SectionTitle title="Похожие товары" />
          <ProductGrid products={related} loading={false} cols={5} />
        </section>
      )}
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="aspect-square skeleton-shimmer rounded-xl" />
        <div className="space-y-4">
          <div className="h-6 skeleton-shimmer rounded w-3/4" />
          <div className="h-4 skeleton-shimmer rounded w-full" />
          <div className="h-4 skeleton-shimmer rounded w-2/3" />
          <div className="h-32 skeleton-shimmer rounded-xl" />
        </div>
        <div className="h-64 skeleton-shimmer rounded-xl" />
      </div>
    </div>
  );
}
