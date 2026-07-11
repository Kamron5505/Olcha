import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import { getProducts, getCategories, normalizeProduct, normalizeCategory } from '../services/api/olchaApi';

const SORT_OPTIONS = [
  { value: '', label: 'По умолчанию' },
  { value: 'popular', label: 'По популярности' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
  { value: 'new', label: 'Новинки' },
];

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || '';
  const popularParam = searchParams.get('popular') || '';
  const saleParam = searchParams.get('sale') || '';
  const newParam = searchParams.get('new') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    getCategories()
      .then((r) => {
        const raw = r.data?.data?.categories || [];
        const list = Array.isArray(raw) ? raw : Object.values(raw);
        setCategories(list.map(normalizeCategory));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const cat = categories.find((c) => String(c.id) === String(categoryId));
      setCurrentCategory(cat || null);
    } else {
      setCurrentCategory(null);
    }
  }, [categoryId, categories]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        page_size: 20,
        ...(categoryId && { category: categoryId }),
        ...(searchQuery && { search: searchQuery }),
        ...(popularParam && { popular: 1 }),
        ...(saleParam && { sale: 1 }),
        ...(newParam && { new: 1 }),
        ...(priceMin && { price_min: priceMin }),
        ...(priceMax && { price_max: priceMax }),
        ...(sortParam === 'price_asc' && { ordering: 'price' }),
        ...(sortParam === 'price_desc' && { ordering: '-price' }),
        ...(sortParam === 'new' && { new: 1 }),
        ...(sortParam === 'popular' && { popular: 1 }),
      };

      const res = await getProducts(params);
      const d = res.data;
      // API v2: { data: { products: [...], paginator: { total, ... } } }
      const list = d?.data?.products || d?.results || [];
      const paginator = d?.data?.paginator || {};
      const total = paginator.total || d?.count || list.length;

      setProducts(list.map(normalizeProduct));
      setCount(total);
      setTotalPages(Math.ceil(total / 20) || 1);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [page, categoryId, searchQuery, sortParam, popularParam, saleParam, newParam, priceMin, priceMax]);

  useEffect(() => {
    setPage(1);
  }, [categoryId, searchQuery, sortParam, popularParam, saleParam, newParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleSort(val) {
    const p = new URLSearchParams(searchParams);
    if (val) p.set('sort', val);
    else p.delete('sort');
    setSearchParams(p);
  }

  function handleFilter(e) {
    e.preventDefault();
    fetchProducts();
    setFilterOpen(false);
  }

  function clearFilters() {
    setPriceMin('');
    setPriceMax('');
    const p = new URLSearchParams();
    if (categoryId) p.set('category', categoryId);
    setSearchParams(p);
  }

  const title = searchQuery
    ? `Поиск: "${searchQuery}"`
    : currentCategory?.name || 'Каталог товаров';

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">{title}</span>
      </nav>

      <div className="flex gap-6">
        {/* Sidebar filter - desktop */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <FilterPanel
            categories={categories}
            categoryId={categoryId}
            priceMin={priceMin}
            priceMax={priceMax}
            setPriceMin={setPriceMin}
            setPriceMax={setPriceMax}
            onFilter={handleFilter}
            onClear={clearFilters}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {!loading && (
                <p className="text-sm text-gray-500 mt-0.5">{count} товаров</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOpen(true)}
                className="md:hidden flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm hover:border-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Фильтр
              </button>
              <select
                value={sortParam}
                onChange={(e) => handleSort(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 transition-colors bg-white"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <div className="text-center py-16 text-red-500">
              <p>{error}</p>
              <button onClick={fetchProducts} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg">
                Повторить
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={products} loading={loading} cols={4} />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setFilterOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Фильтры</h3>
              <button onClick={() => setFilterOpen(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterPanel
              categories={categories}
              categoryId={categoryId}
              priceMin={priceMin}
              priceMax={priceMax}
              setPriceMin={setPriceMin}
              setPriceMax={setPriceMax}
              onFilter={handleFilter}
              onClear={clearFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({ categories, categoryId, priceMin, priceMax, setPriceMin, setPriceMax, onFilter, onClear }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-5">
      <div>
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Категории</h3>
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          <li>
            <Link
              to="/catalog"
              className={`block px-2 py-1.5 rounded text-sm transition-colors ${!categoryId ? 'text-red-600 font-medium bg-red-50' : 'text-gray-700 hover:text-red-600 hover:bg-red-50'}`}
            >
              Все категории
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/catalog?category=${cat.id}`}
                className={`block px-2 py-1.5 rounded text-sm transition-colors ${String(categoryId) === String(cat.id) ? 'text-red-600 font-medium bg-red-50' : 'text-gray-700 hover:text-red-600 hover:bg-red-50'}`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={onFilter}>
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Цена (сум)</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder="От"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"
          />
          <input
            type="number"
            placeholder="До"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Применить
        </button>
        <button
          type="button"
          onClick={onClear}
          className="w-full mt-2 border border-gray-200 hover:border-red-400 text-gray-600 hover:text-red-600 py-2 rounded-lg text-sm transition-colors"
        >
          Сбросить
        </button>
      </form>
    </div>
  );
}
