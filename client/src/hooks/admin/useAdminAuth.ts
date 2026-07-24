'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/api/client';
import { authService } from '@/services';
import type { AdminUser, LoginCredentials } from '@/types';

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface UpdateProfilePayload {
  name: string;
  email: string;
}

interface UseAdminAuthReturn {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!localStorage.getItem('portfolio_token');

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = await authService.fetchCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const adminUser = await authService.login(credentials);
      setUser(adminUser);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
    setError(null);
    try {
      await apiClient.post('/auth/change-password', payload);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to change password.';
      setError(message);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    setError(null);
    try {
      const response = await apiClient.put<{ success: boolean; data: AdminUser }>('/auth/profile', payload);
      const updatedUser = response.data.data;
      setUser(updatedUser);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update profile.';
      setError(message);
      throw err;
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    changePassword,
    updateProfile,
  };
}