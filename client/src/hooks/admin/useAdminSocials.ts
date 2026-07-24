'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import { socialsApi } from '@/api';
import type { SocialLink, ApiResponse } from '@/types';

interface UseAdminSocialsReturn {
  socials: SocialLink[];
  isLoading: boolean;
  error: string | null;
  fetchSocials: () => Promise<void>;
  createSocial: (data: Partial<SocialLink>) => Promise<SocialLink>;
  updateSocial: (id: string, data: Partial<SocialLink>) => Promise<SocialLink>;
  deleteSocial: (id: string) => Promise<void>;
  reorderSocials: (reorder: Array<{ id: string; order: number }>) => Promise<void>;
}

export function useAdminSocials(): UseAdminSocialsReturn {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSocials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await socialsApi.getAll();
      setSocials(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch social links.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSocial = useCallback(async (data: Partial<SocialLink>): Promise<SocialLink> => {
    setError(null);
    try {
      const response = await apiClient.post<ApiResponse<SocialLink>>('/admin/socials', data);
      const created = response.data.data;
      setSocials((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create social link.';
      setError(message);
      throw err;
    }
  }, []);

  const updateSocial = useCallback(async (id: string, data: Partial<SocialLink>): Promise<SocialLink> => {
    setError(null);
    try {
      const response = await apiClient.put<ApiResponse<SocialLink>>(`/admin/socials/${id}`, data);
      const updated = response.data.data;
      setSocials((prev) => prev.map((s) => (s._id === id ? updated : s)));
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update social link.';
      setError(message);
      throw err;
    }
  }, []);

  const deleteSocial = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await apiClient.delete(`/admin/socials/${id}`);
      setSocials((prev) => prev.filter((s) => s._id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete social link.';
      setError(message);
      throw err;
    }
  }, []);

  const reorderSocials = useCallback(async (reorder: Array<{ id: string; order: number }>): Promise<void> => {
    setError(null);
    try {
      await apiClient.put('/admin/socials/reorder', { items: reorder });
      setSocials((prev) =>
        reorder.map((item) => {
          const social = prev.find((s) => s._id === item.id);
          return social ? { ...social, order: item.order } : social;
        }).filter((s): s is SocialLink => s !== undefined),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to reorder social links.';
      setError(message);
      throw err;
    }
  }, []);

  return {
    socials,
    isLoading,
    error,
    fetchSocials,
    createSocial,
    updateSocial,
    deleteSocial,
    reorderSocials,
  };
}