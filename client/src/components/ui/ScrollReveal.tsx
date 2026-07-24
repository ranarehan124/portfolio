import { useEffect, useRef } from 'react';
import { useGsapScrollAnimation } from '@/hooks';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  scrub?: boolean | number;
}

export default function ScrollReveal({
  children,
  className,
  y = 60,
  x = 0,
  opacity = 0,
  scale = 1,
  duration = 1,
  delay = 0,
  stagger,
  scrub,
}: ScrollRevealProps) {
  const ref = useGsapScrollAnimation<HTMLDivElement>({
    y,
    x,
    opacity,
    scale,
    duration,
    delay,
    stagger,
    scrub,
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function ParallaxSection({
  children,
  className,
  speed = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let ctx: { revert: () => void } | undefined;

    async function init() {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
      const gsap = gsapModule.gsap;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to(element, {
          y: () => speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }

    void init();

    return () => {
      ctx?.revert();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function MaskReveal({
  children,
  className,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let ctx: { revert: () => void } | undefined;

    async function init() {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
      const gsap = gsapModule.gsap;

      gsap.registerPlugin(ScrollTrigger);

      const fromProps: Record<string, unknown> = {
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      };

      if (direction === 'up') fromProps.clipPath = 'inset(100% 0 0 0)';
      else if (direction === 'down') fromProps.clipPath = 'inset(0 0 100% 0)';
      else if (direction === 'left') fromProps.clipPath = 'inset(0 100% 0 0)';
      else if (direction === 'right') fromProps.clipPath = 'inset(0 0 0 100%)';

      ctx = gsap.context(() => {
        gsap.from(element, {
          ...fromProps,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }

    void init();

    return () => {
      ctx?.revert();
    };
  }, [direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}