'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import type { AboutContent, ApiResponse } from '@/types';

interface UseAdminAboutReturn {
  about: AboutContent | null;
  isLoading: boolean;
  error: string | null;
  fetchAbout: () => Promise<void>;
  updateAbout: (data: Partial<AboutContent>) => Promise<AboutContent>;
}

export function useAdminAbout(): UseAdminAboutReturn {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAbout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ApiResponse<AboutContent>>('/about');
      setAbout(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch about content.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAbout = useCallback(
    async (data: Partial<AboutContent>): Promise<AboutContent> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.put<ApiResponse<AboutContent>>(
          '/admin/about',
          data,
        );
        const updated = response.data.data;
        setAbout(updated);
        return updated;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to update about content.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    about,
    isLoading,
    error,
    fetchAbout,
    updateAbout,
  };
}