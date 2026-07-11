import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for API calls
 * @param {Function} apiFn - API function to call
 * @param {Array} deps - dependencies to re-fetch on change
 * @param {boolean} immediate - whether to fetch immediately
 */
export function useApi(apiFn, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || 'Ошибка загрузки');
      return null;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...deps]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook for paginated product lists
 */
export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);

  const fetchProducts = useCallback(async (apiFn, fetchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn({ page, page_size: 20, ...params, ...fetchParams });
      const d = res.data;
      // Handle both paginated and non-paginated responses
      if (d.results) {
        setProducts(d.results);
        setCount(d.count || 0);
        setTotalPages(Math.ceil((d.count || 0) / 20));
      } else if (Array.isArray(d)) {
        setProducts(d);
        setCount(d.length);
        setTotalPages(1);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [page, params]);

  return { products, loading, error, page, setPage, totalPages, count, fetchProducts };
}
