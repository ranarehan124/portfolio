'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import type { Education, ApiResponse } from '@/types';

interface UseAdminEducationReturn {
  educationList: Education[];
  isLoading: boolean;
  error: string | null;
  fetchEducation: () => Promise<void>;
  createEducation: (data: Partial<Education>) => Promise<Education>;
  updateEducation: (id: string, data: Partial<Education>) => Promise<Education>;
  deleteEducation: (id: string) => Promise<void>;
}

export function useAdminEducation(): UseAdminEducationReturn {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEducation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ApiResponse<Education[]>>('/admin/education');
      setEducationList(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch education entries.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEducation = useCallback(async (data: Partial<Education>): Promise<Education> => {
    setError(null);
    try {
      const response = await apiClient.post<ApiResponse<Education>>('/admin/education', data);
      const created = response.data.data;
      setEducationList((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create education entry.';
      setError(message);
      throw err;
    }
  }, []);

  const updateEducation = useCallback(async (id: string, data: Partial<Education>): Promise<Education> => {
    setError(null);
    try {
      const response = await apiClient.put<ApiResponse<Education>>(`/admin/education/${id}`, data);
      const updated = response.data.data;
      setEducationList((prev) => prev.map((e) => (e._id === id ? updated : e)));
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update education entry.';
      setError(message);
      throw err;
    }
  }, []);

  const deleteEducation = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await apiClient.delete(`/admin/education/${id}`);
      setEducationList((prev) => prev.filter((e) => e._id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete education entry.';
      setError(message);
      throw err;
    }
  }, []);

  return {
    educationList,
    isLoading,
    error,
    fetchEducation,
    createEducation,
    updateEducation,
    deleteEducation,
  };
}