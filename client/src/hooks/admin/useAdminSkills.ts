'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import type { Skill, ApiResponse } from '@/types';

interface UseAdminSkillsReturn {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
  fetchSkills: () => Promise<void>;
  createSkill: (data: Partial<Skill>) => Promise<Skill>;
  updateSkill: (id: string, data: Partial<Skill>) => Promise<Skill>;
  deleteSkill: (id: string) => Promise<void>;
  reorderSkills: (reorder: Array<{ id: string; order: number }>) => Promise<void>;
}

export function useAdminSkills(): UseAdminSkillsReturn {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ApiResponse<Skill[]>>('/admin/skills');
      setSkills(response.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch skills.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSkill = useCallback(async (data: Partial<Skill>): Promise<Skill> => {
    setError(null);
    try {
      const response = await apiClient.post<ApiResponse<Skill>>('/admin/skills', data);
      const created = response.data.data;
      setSkills((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create skill.';
      setError(message);
      throw err;
    }
  }, []);

  const updateSkill = useCallback(async (id: string, data: Partial<Skill>): Promise<Skill> => {
    setError(null);
    try {
      const response = await apiClient.put<ApiResponse<Skill>>(`/admin/skills/${id}`, data);
      const updated = response.data.data;
      setSkills((prev) => prev.map((s) => (s._id === id ? updated : s)));
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update skill.';
      setError(message);
      throw err;
    }
  }, []);

  const deleteSkill = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await apiClient.delete(`/admin/skills/${id}`);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete skill.';
      setError(message);
      throw err;
    }
  }, []);

  const reorderSkills = useCallback(async (reorder: Array<{ id: string; order: number }>): Promise<void> => {
    setError(null);
    try {
      await apiClient.put('/admin/skills/reorder', { items: reorder });
      setSkills((prev) =>
        reorder.map((item) => {
          const skill = prev.find((s) => s._id === item.id);
          return skill ? { ...skill, order: item.order } : skill;
        }).filter((s): s is Skill => s !== undefined),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to reorder skills.';
      setError(message);
      throw err;
    }
  }, []);

  return {
    skills,
    isLoading,
    error,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    reorderSkills,
  };
}