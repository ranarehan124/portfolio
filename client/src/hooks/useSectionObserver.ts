import { useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';

interface SectionObserverConfig {
  threshold?: number;
  rootMargin?: string;
}

export function useSectionObserver(config: SectionObserverConfig = {}) {
  const { threshold = 0.3, rootMargin = '-10% 0px -10% 0px' } = config;
  const { dispatch } = useAppContext();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          dispatch({
            type: 'SET_ACTIVE_SECTION',
            payload: entry.target.id,
          });
        }
      }
    },
    [dispatch],
  );

  const observe = useCallback(
    (container: HTMLElement | null) => {
      if (!container || observerRef.current) return;

      observerRef.current = new IntersectionObserver(handleIntersect, {
        threshold,
        rootMargin,
      });

      const sections = container.querySelectorAll('section[id]');
      for (const section of sections) {
        observerRef.current.observe(section);
      }
    },
    [threshold, rootMargin, handleIntersect],
  );

  const unobserve = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      unobserve();
    };
  }, [unobserve]);

  return { observe, unobserve };
}

export default useSectionObserver;