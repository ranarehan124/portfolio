'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import type { Project, ApiResponse, PaginatedResponse } from '@/types';

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}

interface UseAdminProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
  fetchProjects: (params?: PaginationParams) => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
}

export function useAdminProjects(): UseAdminProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchProjects = useCallback(async (params: PaginationParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));
      if (params.search) query.set('search', params.search);
      if (params.category) query.set('category', params.category);
      if (params.sort) query.set('sort', params.sort);

      const queryString = query.toString();
      const url = `/admin/projects${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get<PaginatedResponse<Project>>(url);
      const { data, page, totalPages, totalItems } = response.data;

      setProjects(data);
      setPagination({ page, totalPages, totalItems });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch projects.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (data: Partial<Project>): Promise<Project> => {
    setError(null);
    try {
      const response = await apiClient.post<ApiResponse<Project>>('/admin/projects', data);
      const created = response.data.data;
      setProjects((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create project.';
      setError(message);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<Project>): Promise<Project> => {
    setError(null);
    try {
      const response = await apiClient.put<ApiResponse<Project>>(`/admin/projects/${id}`, data);
      const updated = response.data.data;
      setProjects((prev) => prev.map((p) => (p._id === id ? updated : p)));
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update project.';
      setError(message);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await apiClient.delete(`/admin/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete project.';
      setError(message);
      throw err;
    }
  }, []);

  const bulkDelete = useCallback(async (ids: string[]): Promise<void> => {
    setError(null);
    try {
      await apiClient.post('/admin/projects/bulk-delete', { ids });
      setProjects((prev) => prev.filter((p) => !ids.includes(p._id)));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete projects.';
      setError(message);
      throw err;
    }
  }, []);

  return {
    projects,
    isLoading,
    error,
    pagination,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    bulkDelete,
  };
}