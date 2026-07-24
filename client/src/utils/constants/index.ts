/**
 * Application constants
 */

export const APP_NAME = 'Rehan Tahir Portfolio';

export const SOCIALS = {
  github: 'https://github.com/ranarehan124',
  linkedin: 'https://www.linkedin.com/in/rehan-tahir-39496a370/',
  instagram: 'https://instagram.com/ranarehan_77',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
] as const;

export const HERO_TITLES = [
  'Creative Frontend Developer',
  'AI Builder',
  'Interactive Web Experiences',
] as const;

export const PROJECTS = [
  'Void Runner',
  'Zara AI',
  'Vortex Energy Drink',
  'Voltx Energy Drink',
  'RehanShare',
  'Rehan Writes',
  'Nova Estates',
] as const;

export const ANIMATION = {
  EASE: [0.16, 1, 0.3, 1] as const,
  DURATION: {
    fast: 0.3,
    base: 0.5,
    slow: 0.8,
    slower: 1.2,
  },
  STAGGER: 0.1,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const MAX_SECTION_WIDTH = '1280px';

export const API_ENDPOINTS = {
  PROJECTS: '/projects',
  SKILLS: '/skills',
  EXPERIENCE: '/experience',
  CONTACT: '/contact',
  HERO: '/hero',
  SOCIALS: '/socials',
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  UPLOAD: '/upload',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
  },
} as const;