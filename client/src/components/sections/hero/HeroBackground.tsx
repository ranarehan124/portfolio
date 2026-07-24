import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlowOrb } from '@ui';

function HeroBackground() {
  const noiseOverlay = useMemo(
    () =>
      `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Deep black base */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Animated gradient background */}
      <div
        className="absolute inset-0 hero-gradient-animated"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Moving light streaks */}
      <motion.div
        className="absolute w-[600px] h-[1px] top-[30%] -left-[200px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        animate={{
          x: ['0px', '1200px'],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
          delay: 0,
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[1px] top-[60%] -left-[100px] bg-gradient-to-r from-transparent via-accent/15 to-transparent"
        animate={{
          x: ['0px', '1000px'],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
          delay: 3,
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[1px] top-[45%] -left-[150px] bg-gradient-to-r from-transparent via-primary-light/10 to-transparent"
        animate={{
          x: ['0px', '1100px'],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
          delay: 6,
        }}
      />

      {/* Glow orbs for depth */}
      <GlowOrb
        color="purple"
        size="xl"
        className="top-[10%] left-[20%] opacity-50"
        style={{ filter: 'blur(80px)' }}
      />
      <GlowOrb
        color="blue"
        size="lg"
        className="bottom-[10%] right-[15%] opacity-40"
        style={{ filter: 'blur(60px)' }}
      />
      <GlowOrb
        color="mixed"
        size="md"
        className="top-[50%] right-[30%] opacity-30"
        style={{ filter: 'blur(40px)' }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{ backgroundImage: noiseOverlay }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 hero-vignette" />

      {/* Bottom fade for scroll transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
    </div>
  );
}

export default memo(HeroBackground);