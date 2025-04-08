'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export interface NavigationState {
  searchTerm?: string;
  category?: string;
  tag?: string;
  page?: number;
}

export function useNavigationState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getState = useCallback((): NavigationState => {
    return {
      searchTerm: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      tag: searchParams.get('tag') || '',
      page: Number(searchParams.get('page')) || 1,
    };
  }, [searchParams]);

  const setState = useCallback((newState: Partial<NavigationState>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update only provided values
    Object.entries(newState).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Create the new URL with updated params
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return {
    state: getState(),
    setState,
  };
}
