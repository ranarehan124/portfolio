export const APP_NAME = 'Rehan Tahir Portfolio';

export const SOCIALS = {
  github: 'https://github.com/ranarehan124',
  linkedin: 'https://www.linkedin.com/in/rehan-tahir-39496a370/',
  instagram: 'https://instagram.com/ranarehan_77',
   whatsapp: 'https://wa.me/923707918962',
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

export const ROUTES = {
  home: '/',
  admin: {
    login: '/admin/login',
    dashboard: '/admin/dashboard',
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

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

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh-token',
    VALIDATE: '/auth/validate',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  PROJECTS: '/projects',
  SKILLS: '/skills',
  EXPERIENCE: '/experience',
  SERVICES: '/services',
  TESTIMONIALS: '/testimonials',
  CERTIFICATES: '/certificates',
  EDUCATION: '/education',
  CONTACT: '/contact',
  HERO: '/hero',
  ABOUT: '/about',
  SOCIALS: '/socials',
  UPLOAD: '/upload',
  SETTINGS: '/settings',
  SEO: '/seo',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ANALYTICS: '/admin/analytics',
    MESSAGES: '/admin/messages',
    PROJECTS: '/admin/projects',
    SKILLS: '/admin/skills',
    EXPERIENCE: '/admin/experience',
    SERVICES: '/admin/services',
    CERTIFICATES: '/admin/certificates',
    TESTIMONIALS: '/admin/testimonials',
    EDUCATION: '/admin/education',
    HERO: '/admin/hero',
    ABOUT: '/admin/about',
    SOCIALS: '/admin/socials',
    UPLOAD_MULTIPLE: '/admin/upload/multiple',
    UPLOAD_DELETE: '/admin/upload',
    RESUME: '/admin/resume',
    SETTINGS: '/admin/settings',
    SEO: '/admin/seo',
  },
} as const;