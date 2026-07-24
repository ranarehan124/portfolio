'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import type { Testimonial, ApiResponse } from '@/types';

interface UseAdminTestimonialsReturn {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: string | null;
  fetchTestimonials: () => Promise<void>;
  createTestimonial: (data: Partial<Testimonial>) => Promise<Testimonial>;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<Testimonial>;
  deleteTestimonial: (id: string) => Promise<void>;
  toggleFeatured: (id: string, featured: boolean) => Promise<Testimonial>;
  reorderTestimonials: (reorder: Array<{ id: string; order: number }>) => Promise<void>;
}

export function useAdminTestimonials(): UseAdminTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ApiResponse<Testimonial[]>>('/admin/testimonials');
      setTestimonials(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch testimonials.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTestimonial = useCallback(async (data: Partial<Testimonial>): Promise<Testimonial> => {
    setError(null);
    try {
      const response = await apiClient.post<ApiResponse<Testimonial>>('/admin/testimonials', data);
      const created = response.data.data;
      setTestimonials((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create testimonial.';
      setError(message);
      throw err;
    }
  }, []);

  const updateTestimonial = useCallback(async (id: string, data: Partial<Testimonial>): Promise<Testimonial> => {
    setError(null);
    try {
      const response = await apiClient.put<ApiResponse<Testimonial>>(`/admin/testimonials/${id}`, data);
      const updated = response.data.data;
      setTestimonials((prev) => prev.map((t) => (t._id === id ? updated : t)));
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update testimonial.';
      setError(message);
      throw err;
    }
  }, []);

  const deleteTestimonial = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await apiClient.delete(`/admin/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete testimonial.';
      setError(message);
      throw err;
    }
  }, []);

  const toggleFeatured = useCallback(async (id: string, featured: boolean): Promise<Testimonial> => {
    setError(null);
    try {
      const response = await apiClient.patch<ApiResponse<Testimonial>>(`/admin/testimonials/${id}`, { featured });
      const updated = response.data.data;
      setTestimonials((prev) => prev.map((t) => (t._id === id ? updated : t)));
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to toggle testimonial featured status.';
      setError(message);
      throw err;
    }
  }, []);

  const reorderTestimonials = useCallback(async (reorder: Array<{ id: string; order: number }>): Promise<void> => {
    setError(null);
    try {
      await apiClient.put('/admin/testimonials/reorder', { items: reorder });
      setTestimonials((prev) =>
        reorder.map((item) => {
          const testimonial = prev.find((t) => t._id === item.id);
          return testimonial ? { ...testimonial, order: item.order } : testimonial;
        }).filter((t): t is Testimonial => t !== undefined),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to reorder testimonials.';
      setError(message);
      throw err;
    }
  }, []);

  return {
    testimonials,
    isLoading,
    error,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleFeatured,
    reorderTestimonials,
  };
}