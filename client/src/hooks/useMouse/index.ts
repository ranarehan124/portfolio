import { useEffect, useState, useCallback, useRef } from 'react';

interface MouseState {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  isMoving: boolean;
  movementX: number;
  movementY: number;
}

export function useMouse(): MouseState {
  const [state, setState] = useState<MouseState>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    isMoving: false,
    movementX: 0,
    movementY: 0,
  });

  const rafId = useRef<number>(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const moveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const x = e.clientX;
      const y = e.clientY;
      const normalizedX = (x / window.innerWidth) * 2 - 1;
      const normalizedY = -(y / window.innerHeight) * 2 + 1;

      setState((prev) => ({
        ...prev,
        x,
        y,
        normalizedX,
        normalizedY,
        movementX: x - lastPos.current.x,
        movementY: y - lastPos.current.y,
        isMoving: true,
      }));

      lastPos.current = { x, y };

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