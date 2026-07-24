import type { Variants, Transition } from 'framer-motion';

/* ─── Transitions ─────────────────────────────────────────── */

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export const smoothTransition: Transition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
};

export const slowTransition: Transition = {
  duration: 1,
  ease: [0.16, 1, 0.3, 1],
};

export const staggerTransition = (stagger = 0.08): Transition => ({
  staggerChildren: stagger,
  delayChildren: 0.1,
});

/* ─── Fade Variants ───────────────────────────────────────── */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: smoothTransition },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

/* ─── Stagger Container Variants ──────────────────────────── */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: staggerTransition(0.1),
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: staggerTransition(0.15),
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: staggerTransition(0.05),
  },
};

/* ─── Text Variants ───────────────────────────────────────── */

export const charReveal: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const lineReveal: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const letterStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: staggerTransition(0.03),
  },
};

/* ─── Scale Variants ──────────────────────────────────────── */

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

/* ─── Slide Variants ──────────────────────────────────────── */

export const slideInFromLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: '0%',
    opacity: 1,
    transition: smoothTransition,
  },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.3 } },
};

export const slideInFromRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: '0%',
    opacity: 1,
    transition: smoothTransition,
  },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } },
};

export const slideInFromBottom: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: smoothTransition,
  },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.3 } },
};

/* ─── Loading Screen Variants ─────────────────────────────── */

export const loadingScreenVariants: Variants = {
  enter: { opacity: 1 },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(10px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const loadingLogoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const loadingProgressVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 2.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ─── Navbar Variants ─────────────────────────────────────── */

export const navbarVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 2.8,
    },
  },
};

export const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 3 + i * 0.05,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    clipPath: 'circle(0% at calc(100% - 2rem) 2rem)',
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    clipPath: 'circle(150% at calc(100% - 2rem) 2rem)',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

export const mobileMenuItemVariants: Variants = {
  closed: { opacity: 0, x: -30 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─── Hero Variants ───────────────────────────────────────── */

export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: staggerTransition(0.12),
  },
};

export const heroGreetingVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: 2.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const heroNameVariants: Variants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, delay: 2.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const heroTitleVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 3.1 + i * 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export const heroDescriptionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 3.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const heroButtonsVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: staggerTransition(0.1),
  },
};

export const heroSocialsVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: staggerTransition(0.1),
  },
};

/* ─── 3D Scene Variants ───────────────────────────────────── */

export const sceneVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.5, delay: 2.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─── Cursor Variants ─────────────────────────────────────── */

export const cursorVariants: Variants = {
  default: {
    width: 20,
    height: 20,
    x: -10,
    y: -10,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    border: '1px solid rgba(139, 92, 246, 0.5)',
    transition: { type: 'spring', stiffness: 500, damping: 28, mass: 0.5 },
  },
  hover: {
    width: 50,
    height: 50,
    x: -25,
    y: -25,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
    transition: { type: 'spring', stiffness: 400, damping: 25, mass: 0.5 },
  },
  text: {
    width: 100,
    height: 100,
    x: -50,
    y: -50,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    border: '1px solid rgba(96, 165, 250, 0.3)',
    transition: { type: 'spring', stiffness: 400, damping: 25, mass: 0.5 },
  },
  hidden: {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/* ─── Glow / Background Variants ──────────────────────────── */

export const glowPulse: Variants = {
  initial: {
    opacity: 0.4,
    scale: 1,
  },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.05, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};