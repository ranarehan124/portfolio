import { useState, useEffect, useCallback, useRef } from 'react';
import type { HeroContent, Project, Skill, Experience, SocialLink } from '@/types';
import { heroApi, projectsApi, skillsApi, experienceApi, socialsApi } from '@/api';
import { HERO_DATA, SOCIAL_LINKS } from '@/data';

interface CmsState {
  hero: HeroContent | null;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  socials: SocialLink[];
  isLoading: boolean;
  error: string | null;
  isFetched: boolean;
}

const initialState: CmsState = {
  hero: null,
  projects: [],
  skills: [],
  experience: [],
  socials: [],
  isLoading: false,
  error: null,
  isFetched: false,
};

interface UseCmsOptions {
  autoFetch?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export function useCmsData(options: UseCmsOptions = {}) {
  const { autoFetch = true, retryCount = 2, retryDelay = 2000 } = options;
  const [state, setState] = useState<CmsState>(initialState);
  const retryAttempt = useRef(0);
  const abortRef = useRef(false);

  const fetchAll = useCallback(async () => {
    abortRef.current = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const results = await Promise.allSettled([
      heroApi.get().then((r) => r.data.data),
      projectsApi.getAll().then((r) => r.data.data),
      skillsApi.getAll().then((r) => r.data.data),
      experienceApi.getAll().then((r) => r.data.data),
      socialsApi.getAll().then((r) => r.data.data),
    ]);

    if (abortRef.current) return;

    const [heroResult, projectsResult, skillsResult, experienceResult, socialsResult] = results;

    const hasErrors = results.some(
      (r) => r.status === 'rejected',
    );

    if (hasErrors && retryAttempt.current < retryCount) {
      retryAttempt.current += 1;
      setTimeout(() => {
        if (!abortRef.current) fetchAll();
      }, retryDelay);
      return;
    }

    setState({
      hero: heroResult.status === 'fulfilled' ? heroResult.value : null,
      projects: projectsResult.status === 'fulfilled' ? projectsResult.value : [],
      skills: skillsResult.status === 'fulfilled' ? skillsResult.value : [],
      experience: experienceResult.status === 'fulfilled' ? experienceResult.value : [],
      socials: socialsResult.status === 'fulfilled' ? socialsResult.value : [],
      isLoading: false,
      error: hasErrors ? 'Some data could not be loaded from the server.' : null,
      isFetched: true,
    });
  }, [retryCount, retryDelay]);

  useEffect(() => {
    if (autoFetch) {
      void fetchAll();
    }
    return () => {
      abortRef.current = true;
    };
  }, [autoFetch, fetchAll]);

  return { ...state, refetch: fetchAll };
}

export function useHeroContent() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    heroApi
      .get()
      .then((r) => {
        if (!cancelled) setHero(r.data.data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load hero content.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return {
    hero: hero ?? {
      _id: 'static',
      greeting: HERO_DATA.greeting,
      name: HERO_DATA.name,
      titles: HERO_DATA.titles,
      tagline: HERO_DATA.description.slice(0, 100),
      updatedAt: new Date().toISOString(),
    },
    isLoading,
    error,
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    projectsApi
      .getAll()
      .then((r) => {
        if (!cancelled) setProjects(r.data.data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load projects.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { projects, isLoading, error };
}

export function useSocials() {
  const [socials, setSocials] = useState<SocialLink[]>(SOCIAL_LINKS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    socialsApi
      .getAll()
      .then((r) => {
        if (!cancelled && r.data.data.length > 0) setSocials(r.data.data);
      })
      .catch(() => {
        /* Use fallback SOCIAL_LINKS */
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { socials, isLoading };
}

export { initialState as cmsInitialState };