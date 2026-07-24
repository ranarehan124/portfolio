'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import type { Certificate, ApiResponse } from '@/types';

interface UseAdminCertificatesReturn {
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
  fetchCertificates: () => Promise<void>;
  createCertificate: (data: Partial<Certificate>) => Promise<Certificate>;
  updateCertificate: (id: string, data: Partial<Certificate>) => Promise<Certificate>;
  deleteCertificate: (id: string) => Promise<void>;
}

export function useAdminCertificates(): UseAdminCertificatesReturn {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ApiResponse<Certificate[]>>('/admin/certificates');
      setCertificates(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch certificates.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCertificate = useCallback(async (data: Partial<Certificate>): Promise<Certificate> => {
    setError(null);
    try {
      const response = await apiClient.post<ApiResponse<Certificate>>('/admin/certificates', data);
      const created = response.data.data;
      setCertificates((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create certificate.';
      setError(message);
      throw err;
    }
  }, []);

  const updateCertificate = useCallback(async (id: string, data: Partial<Certificate>): Promise<Certificate> => {
    setError(null);
    try {
      const response = await apiClient.put<ApiResponse<Certificate>>(`/admin/certificates/${id}`, data);
      const updated = response.data.data;
      setCertificates((prev) => prev.map((c) => (c._id === id ? updated : c)));
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update certificate.';
      setError(message);
      throw err;
    }
  }, []);

  const deleteCertificate = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await apiClient.delete(`/admin/certificates/${id}`);
      setCertificates((prev) => prev.filter((c) => c._id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete certificate.';
      setError(message);
      throw err;
    }
  }, []);

  return {
    certificates,
    isLoading,
    error,
    fetchCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
  };
}