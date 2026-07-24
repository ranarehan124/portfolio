import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollState {
  scrollY: number;
  scrollProgress: number;
  direction: 'up' | 'down' | 'idle';
  isAtTop: boolean;
  isAtBottom: boolean;
}

export function useScroll(threshold = 10): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    scrollProgress: 0,
    direction: 'idle',
    isAtTop: true,
    isAtBottom: false,
  });

  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;

    const direction =
      scrollY > lastScrollY.current + threshold
        ? 'down'
        : scrollY < lastScrollY.current - threshold
          ? 'up'
          : state.direction;

    lastScrollY.current = scrollY;

    setState({
      scrollY,
      scrollProgress,
      direction,
      isAtTop: scrollY <= 0,
      isAtBottom: scrollY >= docHeight - 5,
    });
  }, [threshold, state.direction]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return state;
}

export default useScroll;