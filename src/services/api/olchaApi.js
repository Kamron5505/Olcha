import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE || 'https://mobile.olcha.uz';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.status, err.message);
    return Promise.reject(err);
  }
);

// ─── Helpers ──────────────────────────────────────────────────
// Normalize category: API v2 uses name_ru, icon field
export function normalizeCategory(cat) {
  return {
    id: cat.id,
    name: cat.name_ru || cat.name || '',
    icon: cat.icon || cat.main_image || null,
    image: cat.main_image || null,
    alias: cat.alias || '',
    children: (cat.children || []).map(normalizeCategory),
  };
}

// Normalize product: API v2 uses total_price, discount_price, main_image
export function normalizeProduct(p) {
  // Изображения: main_image + images массив
  const imagesList = Array.isArray(p.images) ? p.images : [];
  const allImages = p.main_image
    ? [p.main_image, ...imagesList.filter((i) => i !== p.main_image)]
    : imagesList;

  return {
    id: p.id,
    name: p.name_ru || p.name || '',
    price: p.discount_price || p.total_price || 0,
    old_price: p.discount > 0 ? p.total_price : null,
    discount: p.discount || 0,
    image: p.main_image || imagesList[0] || null,
    images: allImages,
    in_stock: p.inStock !== false && p.in_stock !== false,
    installment_price: p.monthly_repayment || null,
    rating: p.comments_rating || null,
    reviews_count: p.comments_count || 0,
    is_new: p.new || false,
    category: p.category || null,
    brand: p.brand || null,
    description: p.short_description_ru || p.description || '',
    attributes: p.attributes || p.chars || [],
    alias: p.alias || '',
    warranty: p.warranty_month ? `${p.warranty_month} мес.` : null,
    cashback: p.cashback || null,
    cashback_percent: p.cashback_percent || null,
  };
}

// ─── Categories ───────────────────────────────────────────────
export const getCategories = () => api.get('/api/v2/categories/');

export const getCategoryById = (id) => api.get(`/api/v2/categories/${id}/`);

// ─── Products ─────────────────────────────────────────────────
export const getProducts = (params = {}) =>
  api.get('/api/v2/products/', { params });

// API v2 не поддерживает /products/{id}/ — используем ?id=
export const getProductById = (id) =>
  api.get('/api/v2/products/', { params: { id } });

export const getProductsByCategory = (categoryId, params = {}) =>
  api.get('/api/v2/products/', { params: { category: categoryId, ...params } });

export const searchProducts = (query, params = {}) =>
  api.get('/api/v2/products/', { params: { search: query, ...params } });

// ─── Banners ──────────────────────────────────────────────────
export const getBanners = () => api.get('/api/v2/banners/');

// ─── Promotions ───────────────────────────────────────────────
export const getPromotions = (params = {}) =>
  api.get('/api/v2/discounts/', { params });

export const getPromotionById = (id) => api.get(`/api/v2/discounts/${id}/`);

export default api;
