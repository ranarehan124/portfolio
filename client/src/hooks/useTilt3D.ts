import { useCallback, useRef, type MouseEvent } from 'react';
import { lerp, clamp } from '@/utils/helpers';

interface TiltConfig {
  max?: number;
  perspective?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
}

export function useTilt3D(config: TiltConfig = {}) {
  const {
    max = 15,
    perspective = 1000,
    speed = 0.4,
    glare = true,
    maxGlare = 0.15,
  } = config;
  const ref = useRef<HTMLDivElement>(null);
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const animate = useCallback(() => {
    current.current.x = lerp(current.current.x, target.current.x, speed);
    current.current.y = lerp(current.current.y, target.current.y, speed);

    if (ref.current) {
      const { x, y } = current.current;
      ref.current.style.transform = `perspective(${perspective}px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        const glareEl = ref.current.querySelector('[data-tilt-glare]') as HTMLElement | null;
        if (glareEl) {
          const glareValue = (Math.abs(x) + Math.abs(y)) / (max * 2);
          glareEl.style.opacity = String(clamp(glareValue * maxGlare * 3, 0, maxGlare));
          const percent = 50 + (x / max) * 30;
          glareEl.style.background = `radial-gradient(circle at ${percent}% 50%, rgba(255,255,255,${glareValue * maxGlare}), transparent 60%)`;
        }
      }
    }

    const dx = Math.abs(target.current.x - current.current.x);
    const dy = Math.abs(target.current.y - current.current.y);
    if (dx > 0.01 || dy > 0.01) {
      rafId.current = requestAnimationFrame(animate);
    }
  }, [max, perspective, speed, glare, maxGlare]);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      target.current.x = (x - 0.5) * max * 2;
      target.current.y = (y - 0.5) * max * 2;

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(animate);
    },
    [max, animate],
  );

  const handleMouseLeave = useCallback(() => {
    target.current.x = 0;
    target.current.y = 0;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(animate);
  }, [animate]);

  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}

export default useTilt3D;