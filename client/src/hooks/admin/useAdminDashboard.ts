'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';

interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalExperience: number;
  totalMessages: number;
  unreadMessages: number;
  recentMessages: Array<{
    _id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: string;
    read: boolean;
  }>;
  messageTrend: Array<{
    date: string;
    count: number;
  }>;
  topProjectCategories: Array<{
    category: string;
    count: number;
  }>;
}

interface UseAdminDashboardReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardStats: () => Promise<void>;
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: DashboardStats }>(
        '/admin/dashboard',
      );
      setStats(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch dashboard stats.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    isLoading,
    error,
    fetchDashboardStats,
  };
}