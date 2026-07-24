import { useState, useEffect, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  progress: number;
  start: () => void;
  finish: () => void;
  reset: () => void;
}

export function useLoading(initialProgress = 0): LoadingState {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(initialProgress);

  const start = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  const finish = useCallback(() => {
    setProgress(100);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (isLoading && progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 15, 95));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress]);

  return { isLoading, progress, start, finish, reset };
}

export default useLoading;