'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';

interface WebsiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  email: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  maintenanceMode: boolean;
}

interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

interface UseSettingsReturn {
  settings: WebsiteSettings | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<WebsiteSettings>) => Promise<WebsiteSettings>;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: WebsiteSettings }>(
        '/admin/settings',
      );
      setSettings(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch settings.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (data: Partial<WebsiteSettings>): Promise<WebsiteSettings> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.put<{ success: boolean; data: WebsiteSettings }>(
          '/admin/settings',
          data,
        );
        const updated = response.data.data;
        setSettings(updated);
        return updated;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to update settings.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
  };
}

interface UseSeoReturn {
  seo: SeoSettings | null;
  isLoading: boolean;
  error: string | null;
  fetchSeo: () => Promise<void>;
  updateSeo: (data: Partial<SeoSettings>) => Promise<SeoSettings>;
}

export function useSeo(): UseSeoReturn {
  const [seo, setSeo] = useState<SeoSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: SeoSettings }>(
        '/admin/settings/seo',
      );
      setSeo(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch SEO settings.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSeo = useCallback(
    async (data: Partial<SeoSettings>): Promise<SeoSettings> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.put<{ success: boolean; data: SeoSettings }>(
          '/admin/settings/seo',
          data,
        );
        const updated = response.data.data;
        setSeo(updated);
        return updated;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to update SEO settings.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    seo,
    isLoading,
    error,
    fetchSeo,
    updateSeo,
  };
}