'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import type { Service, ApiResponse } from '@/types';

interface UseAdminServicesReturn {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  createService: (data: Partial<Service>) => Promise<Service>;
  updateService: (id: string, data: Partial<Service>) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  reorderServices: (reorder: Array<{ id: string; order: number }>) => Promise<void>;
}

export function useAdminServices(): UseAdminServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ApiResponse<Service[]>>('/admin/services');
      setServices(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch services.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createService = useCallback(async (data: Partial<Service>): Promise<Service> => {
    setError(null);
    try {
      const response = await apiClient.post<ApiResponse<Service>>('/admin/services', data);
      const created = response.data.data;
      setServices((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create service.';
      setError(message);
      throw err;
    }
  }, []);

  const updateService = useCallback(async (id: string, data: Partial<Service>): Promise<Service> => {
    setError(null);
    try {
      const response = await apiClient.put<ApiResponse<Service>>(`/admin/services/${id}`, data);
      const updated = response.data.data;
      setServices((prev) => prev.map((s) => (s._id === id ? updated : s)));
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update service.';
      setError(message);
      throw err;
    }
  }, []);

  const deleteService = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await apiClient.delete(`/admin/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete service.';
      setError(message);
      throw err;
    }
  }, []);

  const reorderServices = useCallback(async (reorder: Array<{ id: string; order: number }>): Promise<void> => {
    setError(null);
    try {
      await apiClient.put('/admin/services/reorder', { items: reorder });
      setServices((prev) =>
        reorder.map((item) => {
          const service = prev.find((s) => s._id === item.id);
          return service ? { ...service, order: item.order } : service;
        }).filter((s): s is Service => s !== undefined),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to reorder services.';
      setError(message);
      throw err;
    }
  }, []);

  return {
    services,
    isLoading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
    reorderServices,
  };
}