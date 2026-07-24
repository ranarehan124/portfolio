'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import type { ContactMessage, PaginatedResponse } from '@/types';

interface MessageFilters {
  page?: number;
  limit?: number;
  search?: string;
  read?: boolean | null;
  sort?: string;
}

interface UseAdminMessagesReturn {
  messages: ContactMessage[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
  fetchMessages: (filters?: MessageFilters) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  searchMessages: (query: string, page?: number) => Promise<void>;
}

export function useAdminMessages(): UseAdminMessagesReturn {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const buildQuery = (filters: MessageFilters = {}): string => {
    const query = new URLSearchParams();
    if (filters.page) query.set('page', String(filters.page));
    if (filters.limit) query.set('limit', String(filters.limit));
    if (filters.search) query.set('search', filters.search);
    if (filters.read !== undefined && filters.read !== null) {
      query.set('read', String(filters.read));
    }
    if (filters.sort) query.set('sort', filters.sort);
    return query.toString();
  };

  const fetchMessages = useCallback(async (filters: MessageFilters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryString = buildQuery(filters);
      const url = `/admin/messages${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get<PaginatedResponse<ContactMessage>>(url);
      const { data, page, totalPages, totalItems } = response.data;

      setMessages(data);
      setPagination({ page, totalPages, totalItems });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch messages.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiClient.patch(`/admin/messages/${id}`, { read: true });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: true } : m)),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to mark message as read.';
      setError(message);
      throw err;
    }
  }, []);

  const markAsUnread = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiClient.patch(`/admin/messages/${id}`, { read: false });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: false } : m)),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to mark message as unread.';
      setError(message);
      throw err;
    }
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiClient.delete(`/admin/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete message.';
      setError(message);
      throw err;
    }
  }, []);

  const searchMessages = useCallback(async (query: string, page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams({
        search: query,
        page: String(page),
      });
      const response = await apiClient.get<PaginatedResponse<ContactMessage>>(
        `/admin/messages?${searchParams.toString()}`,
      );
      const { data, page: respPage, totalPages, totalItems } = response.data;

      setMessages(data);
      setPagination({ page: respPage, totalPages, totalItems });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to search messages.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    pagination,
    fetchMessages,
    markAsRead,
    markAsUnread,
    deleteMessage,
    searchMessages,
  };
}