/**
 * Lightweight replacements for @tanstack/react-query hooks.
 * Built for React Native where `window` does not exist.
 */
import { useState, useEffect, useCallback, useRef } from 'react';

// ─── useQuery ───────────────────────────────────────────────
interface UseQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  enabled?: boolean;
}

interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useQuery<T = any>(options: UseQueryOptions<T>): UseQueryResult<T> {
  const { queryFn, enabled = true } = options;
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (e: any) {
      if (mountedRef.current) {
        setError(e);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [queryFn]);

  useEffect(() => {
    mountedRef.current = true;
    if (enabled) {
      fetchData();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [enabled, ...options.queryKey]);

  return { data, isLoading, error, refetch: fetchData };
}

// ─── useMutation ────────────────────────────────────────────
interface UseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  data: TData | undefined;
  error: Error | null;
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

export function useMutation<TData = any, TVariables = any>(
  options: UseMutationOptions<TData, TVariables>,
): UseMutationResult<TData, TVariables> {
  const { mutationFn, onSuccess, onError } = options;
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setIsPending(true);
      setError(null);
      setIsSuccess(false);
      try {
        const result = await mutationFn(variables);
        setData(result);
        setIsSuccess(true);
        onSuccess?.(result);
        return result;
      } catch (e: any) {
        setError(e);
        onError?.(e);
        throw e;
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, onSuccess, onError],
  );

  const mutate = useCallback(
    (variables: TVariables) => {
      mutateAsync(variables).catch(() => {}); // swallow — error is in state
    },
    [mutateAsync],
  );

  return {
    mutate,
    mutateAsync,
    data,
    error,
    isPending,
    isLoading: isPending,
    isError: !!error,
    isSuccess,
  };
}
