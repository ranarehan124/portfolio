import { useRef, useCallback, type MouseEvent } from 'react';
import { lerp } from '@/utils/helpers';

interface MagneticConfig {
  strength?: number;
  ease?: number;
  radius?: number;
}

export function useMagnetic(config: MagneticConfig = {}) {
  const { strength = 0.3, ease = 0.15, radius = 200 } = config;
  const ref = useRef<HTMLElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const animate = useCallback(() => {
    position.current.x = lerp(
      position.current.x,
      target.current.x,
      ease,
    );
    position.current.y = lerp(
      position.current.y,
      target.current.y,
      ease,
    );

    if (ref.current) {
      ref.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
    }

    const dx = Math.abs(target.current.x - position.current.x);
    const dy = Math.abs(target.current.y - position.current.y);

    if (dx > 0.01 || dy > 0.01) {
      rafId.current = requestAnimationFrame(animate);
    }
  }, [ease]);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < radius) {
        target.current.x = distanceX * strength;
        target.current.y = distanceY * strength;
      } else {
        target.current.x = 0;
        target.current.y = 0;
      }

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(animate);
    },
    [strength, radius, animate],
  );

  const handleMouseLeave = useCallback(() => {
    target.current.x = 0;
    target.current.y = 0;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(animate);
  }, [animate]);

  const reset = useCallback(() => {
    target.current.x = 0;
    target.current.y = 0;
    position.current.x = 0;
    position.current.y = 0;
    if (ref.current) {
      ref.current.style.transform = 'translate(0, 0)';
    }
  }, []);

  return {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    reset,
  };
}

export default useMagnetic;