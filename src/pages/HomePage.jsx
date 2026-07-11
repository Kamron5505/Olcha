import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BannerSlider from '../components/BannerSlider';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import SectionTitle from '../components/SectionTitle';
import { useLang } from '../context/LangContext';
import {
  getCategories,
  getProducts,
  getBanners,
  normalizeCategory,
  normalizeProduct,
} from '../services/api/olchaApi';

export default function HomePage() {
  const { t } = useLang();
  const [banners, setBanners] = useState([]);
  const [smallBanners, setSmallBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);
  const [loadingSale, setLoadingSale] = useState(true);

  useEffect(() => {
    // Banners
    getBanners()
      .then((r) => {
        const b = r.data?.data?.banners || {};

        // Главный слайдер: header (объект) + popular (объект) → массив
        const headerSlides = [];
        if (b.header && typeof b.header === 'object' && b.header.image_url_ru) {
          headerSlides.push(b.header);
        }
        if (b.popular && typeof b.popular === 'object' && b.popular.image_url_ru) {
          headerSlides.push(b.popular);
        }
        setBanners(headerSlides);

        // Маленькие баннеры под слайдером
        const bottom = Array.isArray(b.header_bottom) ? b.header_bottom : [];
        setSmallBanners(bottom);
      })
      .catch(() => {});

    // Categories
    getCategories()
      .then((r) => {
        const raw = r.data?.data?.categories || [];
        const list = Array.isArray(raw) ? raw : Object.values(raw);
        setCategories(list.map(normalizeCategory));
      })
      .catch(() => {})
      .finally(() => setLoadingCats(false));

    // Popular products
    getProducts({ popular: 1, page_size: 10 })
      .then((r) => {
        const list = r.data?.data?.products || r.data?.results || [];
        setPopularProducts(list.map(normalizeProduct));
      })
      .catch(() => {})
      .finally(() => setLoadingPopular(false));

    // New products
    getProducts({ new: 1, page_size: 10 })
      .then((r) => {
        const list = r.data?.data?.products || r.data?.results || [];
        setNewProducts(list.map(normalizeProduct));
      })
      .catch(() => {})
      .finally(() => setLoadingNew(false));

    // Sale products
    getProducts({ sale: 1, page_size: 10 })
      .then((r) => {
        const list = r.data?.data?.products || r.data?.results || [];
        setSaleProducts(list.map(normalizeProduct));
      })
      .catch(() => {})
      .finally(() => setLoadingSale(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-4 space-y-8">
      {/* Banner + Categories sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-3">
        {/* Sidebar categories */}
        <div className="hidden lg:block bg-white rounded-xl border border-gray-100 overflow-hidden self-start">
          <div className="bg-red-600 text-white px-4 py-3 font-semibold text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {t('all_categories_title')}
          </div>
          <ul className="py-1 max-h-[340px] overflow-y-auto">
            {loadingCats
              ? Array.from({ length: 8 }).map((_, i) => (
                  <li key={i} className="px-4 py-2.5">
                    <div className="h-4 skeleton-shimmer rounded w-3/4" />
                  </li>
                ))
              : categories.slice(0, 15).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/catalog?category=${cat.id}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors group"
                    >
                      {cat.icon && (
                        <img
                          src={cat.icon}
                          alt=""
                          className="w-5 h-5 object-contain flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <span className="flex-1 truncate">{cat.name}</span>
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
          </ul>
        </div>

        {/* Banner slider */}
        <BannerSlider banners={banners} />
      </div>

      {/* Small banners row */}
      {smallBanners.length > 0 && (
        <div className={`grid gap-3 ${smallBanners.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {smallBanners.slice(0, 2).map((b, i) => {
            const img = b.image_url_ru || b.image_url || b.image || '';
            const href = b.url
              ? b.url.startsWith('/')
                ? b.url
                : `/catalog?q=${b.url}`
              : '/catalog';
            return img ? (
              <Link
                key={b.id || i}
                to={href}
                className="block rounded-xl overflow-hidden"
                style={{ height: '160px' }}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.closest('a').style.display = 'none'; }}
                />
              </Link>
            ) : null;
          })}
        </div>
      )}

      {/* Category icons grid */}
      <section>
        <SectionTitle title={t('categories')} link="/catalog" linkText={t('all_categories')} />
        <CategoryGrid categories={categories} loading={loadingCats} />
      </section>

      {/* Popular products */}
      <section>
        <SectionTitle title={t('popular_products')} link="/catalog?popular=1" />
        <ProductGrid products={popularProducts} loading={loadingPopular} cols={5} />
      </section>

      {/* Sale products */}
      <section>
        <SectionTitle title={t('sale_products')} link="/catalog?sale=1" />
        <ProductGrid products={saleProducts} loading={loadingSale} cols={5} />
      </section>

      {/* New products */}
      <section>
        <SectionTitle title={t('new_products')} link="/catalog?new=1" />
        <ProductGrid products={newProducts} loading={loadingNew} cols={5} />
      </section>

      {/* Info blocks */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '🚚', title: t('fast_delivery'), desc: t('fast_delivery_desc') },
          { icon: '💳', title: t('installment'), desc: t('installment_desc') },
          { icon: '✅', title: t('original'), desc: t('original_desc') },
          { icon: '🔄', title: t('return'), desc: t('return_desc') },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl p-4 flex items-center gap-3 border border-gray-100">
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="font-semibold text-sm text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
