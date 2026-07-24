import { useEffect, useRef, useState, useCallback } from 'react';

interface CountUpOptions {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function useCountUp(options: CountUpOptions) {
  const { end, duration = 2, prefix = '', suffix = '', decimals = 0 } = options;
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const hasStartedRef = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number>(0);

  const animate = useCallback(() => {
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;

      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }, [end, duration, prefix, suffix, decimals]);

  const start = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    animate();
  }, [animate]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: if element is already in view on mount, start immediately.
    const rect = el.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight && rect.bottom > 0 && rect.height > 0;

    if (alreadyVisible) {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [start]);

  return { ref, display };
}

export default useCountUp;