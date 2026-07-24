import { useRef, useEffect, useCallback } from 'react';

interface UseScrollTriggerOptions {
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onUpdate?: (progress: number) => void;
}

export function useScrollTrigger(options: UseScrollTriggerOptions = {}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const stInstance = useRef<unknown>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
      const gsap = gsapModule.gsap;

      gsap.registerPlugin(ScrollTrigger);

      const triggerElement = options.trigger
        ? document.querySelector(options.trigger)
        : triggerRef.current;

      if (!triggerElement || !mounted) return;

      stInstance.current = ScrollTrigger.create({
        trigger: triggerElement,
        start: options.start ?? 'top 80%',
        end: options.end ?? 'bottom 20%',
        scrub: options.scrub ?? false,
        markers: options.markers ?? false,
        toggleActions: options.toggleActions,
        onEnter: options.onEnter,
        onLeave: options.onLeave,
        onEnterBack: options.onEnterBack,
        onLeaveBack: options.onLeaveBack,
        onUpdate: options.onUpdate
          ? (self: { progress: number }) => options.onUpdate?.(self.progress)
          : undefined,
      });
    }

    void init();

    return () => {
      mounted = false;
      if (stInstance.current) {
        (stInstance.current as { kill: () => void }).kill();
        stInstance.current = null;
      }
    };
  }, [options.trigger, options.start, options.end, options.scrub, options.markers, options.toggleActions, options.onEnter, options.onLeave, options.onEnterBack, options.onLeaveBack, options.onUpdate]);

  const scrollTo = useCallback(
    (position?: string) => {
      if (!triggerRef.current) return;
      triggerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: position === 'top' ? 'start' : position === 'bottom' ? 'end' : 'center',
      });
    },
    [],
  );

  return { triggerRef, scrollTrigger: stInstance, scrollTo };
}

export default useScrollTrigger;