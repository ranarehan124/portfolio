import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';
import {
  loadingScreenVariants,
  loadingLogoVariants,
} from '@/animations';
import ParticleName from '../ParticleName';

function LoadingScreen() {
  const { state, dispatch } = useAppContext();
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.5 + 0.1,
    })),
  );

  const progress = useMemo(() => {
    if (!state.isLoading) return 100;
    return state.loadingProgress;
  }, [state.isLoading, state.loadingProgress]);

  const progressRef = useRef(state.loadingProgress);

 useEffect(() => {
    const progressInterval = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + Math.random() * 12 + 3, 100);

      if (progressRef.current >= 100) {
        clearInterval(progressInterval);
        dispatch({
          type: 'SET_LOADING',
          payload: { isLoading: false, progress: 100 },
        });
      } else {
        dispatch({
          type: 'SET_LOADING',
          payload: { isLoading: true, progress: progressRef.current },
        });
      }
    }, 150);

    return () => {
      clearInterval(progressInterval);
    };
  }, [dispatch]);
  
  return (
    <AnimatePresence>
      {state.isLoading && (
        <motion.div
          className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[#050505]"
          variants={loadingScreenVariants}
          initial="enter"
          exit="exit"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
              style={{
                background:
                  'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(96,165,250,0.08) 40%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
            <div
              className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full opacity-20"
              style={{
                background:
                  'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 60%)',
                filter: 'blur(40px)',
              }}
            />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-primary/30"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [p.opacity, p.opacity * 2, p.opacity],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <motion.div
            className="relative z-10 mb-12"
            variants={loadingLogoVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <span className="text-white font-bold text-lg">R</span>
              </motion.div>
              <div className="flex flex-col">
                <ParticleName
  text="REHAN TAHIR"
  colors={['#FFFFFF', '#8B7CF6', '#B4A6FF']}
  width={320}
  height={56}
  fontSize={38}
  formMs={500}
/>
                <span className="text-white/40 text-xs font-mono tracking-wider">
                  PORTFOLIO
                </span>
              </div>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="relative z-10 w-96 h-[3px] bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-primary-light to-accent rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </div>

          {/* Progress percentage */}
          <motion.p className="relative z-10 mt-6 font-mono text-xs text-white/30 tracking-widest">
            {Math.round(progress)}%
          </motion.p>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;