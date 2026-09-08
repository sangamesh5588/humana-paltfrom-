import { useState, useEffect, useRef, useCallback } from 'react';
import ApiClient from '../../../../core/api/client';

export function useMasterDataSearch(endpoint: string) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Force a re-fetch with the current query
  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let active = true;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await ApiClient.get(`${endpoint}/search`, {
          params: { q: query, limit: 15 },
        });
        if (active) {
          setResults(response.data?.data || response.data || []);
        }
      } catch (error) {
        if (active) {
          setResults([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, endpoint, refreshKey]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    refresh,
  };
}
