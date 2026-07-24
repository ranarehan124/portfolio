'use client';

import { useState, useCallback } from 'react';
import { heroApi } from '@/api';
import type { HeroContent } from '@/types';

interface UseAdminHeroReturn {
  hero: HeroContent | null;
  isLoading: boolean;
  error: string | null;
  fetchHero: () => Promise<void>;
  updateHero: (data: Partial<HeroContent>) => Promise<HeroContent>;
}

export function useAdminHero(): UseAdminHeroReturn {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHero = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await heroApi.get();
      setHero(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch hero content.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateHero = useCallback(async (data: Partial<HeroContent>): Promise<HeroContent> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await heroApi.update(data);
      const updated = response.data.data;
      setHero(updated);
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update hero content.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    hero,
    isLoading,
    error,
    fetchHero,
    updateHero,
  };
}