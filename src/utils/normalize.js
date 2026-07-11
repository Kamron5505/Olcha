/**
 * Normalize product from API v2 format to unified format
 */
export function normalizeProduct(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name_ru || p.name || '',
    image: p.main_image || null,
    images: p.images || (p.main_image ? [p.main_image] : []),
    price: Number(p.total_price || p.discount_price || 0),
    old_price: p.discount > 0 ? Number(p.discount_price || 0) + Number(p.discount_value || 0) : null,
    discount: p.discount || 0,
    discount_value: p.discount_value,
    installment_price: p.monthly_repayment || null,
    in_stock: p.inStock !== false && p.in_stock !== false,
    category: p.category || null,
    brand: p.brand || null,
    rating: p.comments_rating ? Number(p.comments_rating) : null,
    reviews_count: p.comments_count || 0,
    description: p.short_description_ru || p.description || '',
    attributes: p.attributes || p.specifications || [],
    is_new: p.new === 1,
    alias: p.alias || '',
    _raw: p,
  };
}

/**
 * Normalize category from API v2
 */
export function normalizeCategory(c) {
  if (!c) return null;
  return {
    id: c.id,
    name: c.name_ru || c.name || '',
    icon: c.icon || c.main_image || null,
    image: c.main_image || null,
    alias: c.alias || '',
    link: c.link || '',
    children: (c.children || []).map(normalizeCategory),
    parent_id: c.parent_id || null,
  };
}

/**
 * Extract products list + pagination from API v2 response
 */
export function extractProducts(responseData) {
  if (!responseData) return { products: [], total: 0, lastPage: 1 };
  const d = responseData.data || responseData;
  const products = (d.products || d.results || d || []).map(normalizeProduct);
  const paginator = d.paginator || {};
  return {
    products,
    total: paginator.last_page ? paginator.last_page * 10 : products.length,
    lastPage: paginator.last_page || 1,
    currentPage: paginator.current_page || 1,
  };
}

/**
 * Extract categories from API v2 response
 */
export function extractCategories(responseData) {
  if (!responseData) return [];
  const d = responseData.data || responseData;
  const list = d.data || d.categories || d || [];
  return Array.isArray(list) ? list.map(normalizeCategory) : [];
}
