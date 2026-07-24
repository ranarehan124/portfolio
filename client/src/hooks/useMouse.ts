import { useEffect, useState, useCallback, useRef } from 'react';

interface MouseState {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  isMoving: boolean;
}

export function useMouse(): MouseState {
  const [state, setState] = useState<MouseState>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    isMoving: false,
  });

  const rafId = useRef<number>(0);
  const moveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const x = e.clientX;
      const y = e.clientY;

      setState({
        x,
        y,
        normalizedX: (x / window.innerWidth) * 2 - 1,
        normalizedY: -(y / window.innerHeight) * 2 + 1,
        isMoving: true,
      });

      if (moveTimeout.current) clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => {
        setState((prev) => ({ ...prev, isMoving: false }));
      }, 150);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (moveTimeout.current) clearTimeout(moveTimeout.current);
    };
  }, [handleMouseMove]);

  return state;
}

export default useMouse;