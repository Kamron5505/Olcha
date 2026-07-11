import { useState, useCallback, useRef } from 'react';
import { searchProducts } from '../services/api/olchaApi';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const search = useCallback((q) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchProducts(q, { page_size: 8 });
        const d = res.data;
        // API v2: { data: { products: [...] } }
        const list = d?.data?.products || d?.results || [];
        setResults(list.map((p) => ({
          id: p.id,
          name: p.name_ru || p.name || '',
          price: p.discount_price || p.total_price || 0,
          image: p.main_image || null,
        })));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return { query, results, loading, search, clear };
}
