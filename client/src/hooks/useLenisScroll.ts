import { useCallback, useEffect, useRef } from 'react';
import { useSmoothScroll } from '@/contexts/providers/SmoothScrollProvider';

interface LenisScrollOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}

export function useLenisScroll() {
  const { lenis } = useSmoothScroll();
  const isScrolling = useRef(false);

  const scrollTo = useCallback(
    (target: string | number, options: LenisScrollOptions = {}) => {
      if (!lenis) return;
      const { offset = 0, duration = 1.2, immediate = false } = options;

      let scrollTarget: number;
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (!el) return;
        const lenisOffset = (lenis.options as Record<string, unknown>).offset;
        scrollTarget =
          (el as HTMLElement).offsetTop + offset - (typeof lenisOffset === 'number' ? lenisOffset : 0);
      } else {
        scrollTarget = target;
      }

      lenis.scrollTo(scrollTarget, { duration, immediate });
    },
    [lenis],
  );

  const scrollToTop = useCallback(() => {
    scrollTo(0, { duration: 0.8 });
  }, [scrollTo]);

  useEffect(() => {
    if (!lenis) return;

    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      isScrolling.current = Math.abs(velocity) > 0.01;
    });

    return () => {
      lenis.off('scroll', () => {});
    };
  }, [lenis]);

  return { scrollTo, scrollToTop, lenis, isScrolling };
}

export default useLenisScroll;