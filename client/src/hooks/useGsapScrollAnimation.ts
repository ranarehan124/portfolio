import { useEffect, useRef } from 'react';

interface UseGsapScrollAnimationOptions {
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  rotation?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  scrub?: boolean | number;
  start?: string;
  end?: string;
}

export function useGsapScrollAnimation<T extends HTMLElement>(
  options: UseGsapScrollAnimationOptions = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let ctx: { revert: () => void } | undefined;

    async function animate() {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
      const gsap = gsapModule.gsap;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const animConfig: Record<string, unknown> = {
          y: options.y ?? 60,
          opacity: options.opacity ?? 0,
          duration: options.duration ?? 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: options.start ?? 'top 85%',
            end: options.end ?? 'bottom 20%',
            toggleActions: 'play none none reverse',
            ...(options.scrub !== undefined ? { scrub: options.scrub } : {}),
          },
        };

        if (options.x !== undefined) animConfig.x = options.x;
        if (options.scale !== undefined) animConfig.scale = options.scale;
        if (options.rotation !== undefined) animConfig.rotation = options.rotation;
        if (options.delay !== undefined) animConfig.delay = options.delay;

        if (options.stagger !== undefined && element!.children.length > 0) {
          animConfig.stagger = options.stagger;
          gsap.from(Array.from(element!.children), animConfig);
        } else if (element) {
          gsap.from(element!, animConfig);
        }
      });
    }

    void animate();

    return () => {
      ctx?.revert();
    };
  }, [options.y, options.x, options.opacity, options.scale, options.rotation, options.duration, options.delay, options.stagger, options.scrub, options.start, options.end]);

  return ref;
}

export default useGsapScrollAnimation;