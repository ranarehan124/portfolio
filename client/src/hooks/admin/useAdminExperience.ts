'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import type { Experience, ApiResponse } from '@/types';

interface UseAdminExperienceReturn {
  experience: Experience[];
  isLoading: boolean;
  error: string | null;
  fetchExperience: () => Promise<void>;
  createExperience: (data: Partial<Experience>) => Promise<Experience>;
  updateExperience: (id: string, data: Partial<Experience>) => Promise<Experience>;
  deleteExperience: (id: string) => Promise<void>;
  reorderExperience: (reorder: Array<{ id: string; order: number }>) => Promise<void>;
}

export function useAdminExperience(): UseAdminExperienceReturn {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperience = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ApiResponse<Experience[]>>('/admin/experience');
      setExperience(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch experience entries.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createExperience = useCallback(async (data: Partial<Experience>): Promise<Experience> => {
    setError(null);
    try {
      const response = await apiClient.post<ApiResponse<Experience>>('/admin/experience', data);
      const created = response.data.data;
      setExperience((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create experience entry.';
      setError(message);
      throw err;
    }
  }, []);

  const updateExperience = useCallback(async (id: string, data: Partial<Experience>): Promise<Experience> => {
    setError(null);
    try {
      const response = await apiClient.put<ApiResponse<Experience>>(`/admin/experience/${id}`, data);
      const updated = response.data.data;
      setExperience((prev) => prev.map((e) => (e._id === id ? updated : e)));
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update experience entry.';
      setError(message);
      throw err;
    }
  }, []);

  const deleteExperience = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await apiClient.delete(`/admin/experience/${id}`);
      setExperience((prev) => prev.filter((e) => e._id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete experience entry.';
      setError(message);
      throw err;
    }
  }, []);

  const reorderExperience = useCallback(async (reorder: Array<{ id: string; order: number }>): Promise<void> => {
    setError(null);
    try {
      await apiClient.put('/admin/experience/reorder', { items: reorder });
      setExperience((prev) =>
        reorder.map((item) => {
          const entry = prev.find((e) => e._id === item.id);
          return entry ? { ...entry, order: item.order } : entry;
        }).filter((e): e is Experience => e !== undefined),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to reorder experience entries.';
      setError(message);
      throw err;
    }
  }, []);

  return {
    experience,
    isLoading,
    error,
    fetchExperience,
    createExperience,
    updateExperience,
    deleteExperience,
    reorderExperience,
  };
}