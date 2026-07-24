import {
  createContext,
  useContext,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import { AnimatePresence } from 'framer-motion';

interface AnimationContextValue {
  scope: React.RefObject<HTMLDivElement | null>;
}

const AnimationContext = createContext<AnimationContextValue | undefined>(
  undefined,
);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  return (
    <AnimationContext.Provider value={{ scope }}>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </AnimationContext.Provider>
  );
}

export function useAnimationScope(): AnimationContextValue {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error(
      'useAnimationScope must be used within an AnimationProvider',
    );
  }
  return context;
}

export { AnimatePresence };
export const useGsap = () => {
  const gsapCallback = useCallback(async () => {
    const gsapModule = await import('gsap');
    const gsap = gsapModule.default || gsapModule;
    return gsap;
  }, []);
  return { gsapCallback };
};

export default AnimationContext;