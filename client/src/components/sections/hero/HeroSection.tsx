import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sceneVariants } from '@/animations';
import { useIsMobile } from '@/hooks';
import HeroContent from './HeroContent';
import HeroBackground from './HeroBackground';

const HeroScene = lazy(
  () => import('@three/scenes/HeroScene'),
);

function HeroSceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
}

function HeroSection() {
  const isMobile = useIsMobile();
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowScene(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden flex items-center"
    >
      <HeroBackground />

      <div className="relative z-10 section-container h-full min-h-screen flex items-center">
        <div
          className={`grid grid-cols-1 ${
            isMobile
              ? 'grid-rows-[1fr]'
              : 'lg:grid-cols-[1fr_1fr]'
          } gap-8 lg:gap-4 items-center w-full py-24 lg:py-0`}
        >
          {/* Left: Text Content */}
          <div className={isMobile ? 'pb-20' : ''}>
            <HeroContent />
          </div>

          {/* Right: 3D Scene + Character Image */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[700px] xl:h-[800px]">
            <motion.div
              className="absolute inset-0 rounded-3xl overflow-hidden"
              variants={sceneVariants}
              initial="hidden"
              animate="visible"
            >
              {showScene && (
                <Suspense fallback={<HeroSceneFallback />}>
                  <HeroScene isMobile={isMobile} />
                </Suspense>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-mono text-[10px] text-white/20 tracking-[0.3em] uppercase">
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-primary/50 to-transparent"
          animate={{ scaleY: [0, 1, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </section>
  );
}

export default HeroSection;