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
  const directionRef = useRef<'up' | 'down' | 'idle'>('idle');

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;

    if (scrollY > lastScrollY.current + threshold) {
      directionRef.current = 'down';
    } else if (scrollY < lastScrollY.current - threshold) {
      directionRef.current = 'up';
    }

    lastScrollY.current = scrollY;

    setState({
      scrollY,
      scrollProgress,
      direction: directionRef.current,
      isAtTop: scrollY <= 0,
      isAtBottom: scrollY >= docHeight - 5,
    });
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return state;
}

export default useScroll;