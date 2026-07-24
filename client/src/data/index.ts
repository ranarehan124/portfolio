import type { SocialLink } from '@/types';

export const SOCIAL_LINKS: SocialLink[] = [
  { _id: 'social-github', platform: 'GitHub', url: 'https://github.com/ranarehan124', icon: 'github', order: 1 },
  { _id: 'social-linkedin', platform: 'LinkedIn', url: 'https://www.linkedin.com/in/rehan-tahir-39496a370/', icon: 'linkedin', order: 2 },
  { _id: 'social-instagram', platform: 'Instagram', url: 'https://instagram.com/ranarehan_77', icon: 'instagram', order: 3 },
];

export const HERO_DATA = {
  greeting: "Hello, I'm",
  name: 'Rehan Tahir',
  titles: ['Creative Frontend Developer', 'Interactive Web Engineer', 'AI Application Builder'],
  description:
    'I craft immersive digital experiences that live at the intersection of design and engineering. From physics-driven 3D interfaces to AI-powered applications, I transform bold ideas into polished, performant products that captivate users and push the boundaries of what the modern web can deliver. Every pixel is intentional, every animation tells a story, and every interaction feels effortless.',
  cta: {
    primary: { label: 'Explore My Work', href: '#projects' },
    secondary: { label: 'Download Resume', href: `${import.meta.env.BASE_URL}resume.pdf` },
    tertiary: { label: 'Contact Me', href: '#contact' },
  },
};

/* ─── About ──────────────────────────────────────────────── */

export const ABOUT_STATS = [
  { label: 'Years Frontend Experience', value: 2, suffix: '+', prefix: '' },
  { label: 'Completed Personal Projects', value: 7, suffix: '+', prefix: '' },
  { label: 'Languages', value: 3, suffix: '', prefix: '' },
  { label: 'Passion For Learning', value: 100, suffix: '%', prefix: '' },
] as const;

/* ─── Skills ─────────────────────────────────────────────── */

export interface SkillItem {
  name: string;
  icon: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'HTML', icon: 'html5', level: 95 },
      { name: 'CSS', icon: 'css3', level: 90 },
      { name: 'JavaScript', icon: 'javascript', level: 88 },
      { name: 'TypeScript', icon: 'typescript', level: 80 },
      { name: 'React', icon: 'react', level: 85 },
      { name: 'TailwindCSS', icon: 'tailwindcss', level: 90 },
      { name: 'Three.js', icon: 'threejs', level: 70 },
      { name: 'React Three Fiber', icon: 'react', level: 68 },
      { name: 'GSAP', icon: 'greensock', level: 75 },
      { name: 'Framer Motion', icon: 'framer', level: 80 },
      { name: 'Responsive Design', icon: 'responsive', level: 92 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: 'nodejs', level: 70 },
      { name: 'Express.js', icon: 'express', level: 68 },
      { name: 'MongoDB', icon: 'mongodb', level: 65 },
      { name: 'REST API', icon: 'api', level: 75 },
      { name: 'Authentication', icon: 'auth', level: 65 },
    ],
  },
  {
    title: 'Development Tools',
    skills: [
      { name: 'Git', icon: 'git', level: 85 },
      { name: 'GitHub', icon: 'github', level: 85 },
      { name: 'VS Code', icon: 'vscode', level: 95 },
      { name: 'Vite', icon: 'vite', level: 80 },
      { name: 'npm', icon: 'npm', level: 85 },
    ],
  },
  {
    title: 'AI & Productivity',
    skills: [
      { name: 'ChatGPT', icon: 'chatgpt', level: 90 },
      { name: 'Claude', icon: 'claude', level: 92 },
      { name: 'Google AI Studio', icon: 'googleai', level: 75 },
      { name: 'GLM', icon: 'glm', level: 70 },
      { name: 'Cursor AI', icon: 'cursor', level: 78 },
      { name: 'Lovable', icon: 'lovable', level: 72 },
      { name: 'Replit', icon: 'replit', level: 70 },
    ],
  },
  {
    title: 'Business Skills',
    skills: [
      { name: 'LinkedIn Outreach', icon: 'linkedin', level: 85 },
      { name: 'Lead Generation', icon: 'leads', level: 80 },
      { name: 'Email Marketing', icon: 'email', level: 75 },
      { name: 'Export Communication', icon: 'export', level: 78 },
    ],
  },
];

/* ─── Experience ─────────────────────────────────────────── */

export const EXPERIENCE_DATA = [
  {
    id: 'exp-1',
    company: 'Royal Care Pvt Ltd',
    role: 'LinkedIn Outreach & Export Department',
    location: 'Lahore, Pakistan',
    startDate: '2024',
    endDate: null,
    current: true,
    description:
      'Managing professional LinkedIn outreach campaigns and supporting the export department with digital communication strategies. Responsible for building connection pipelines, crafting outreach messages, and maintaining client relationships across international markets.',
    highlights: [
      'Lead LinkedIn outreach campaigns for international client acquisition',
      'Developed structured communication workflows for export operations',
      'Built and maintained professional network of 500+ industry contacts',
      'Supported digital transformation of traditional export processes',
    ],
  },
  {
    id: 'exp-2',
    company: 'Self-Taught Frontend Development',
    role: 'Creative Frontend Developer',
    location: 'Lahore, Pakistan',
    startDate: '2023',
    endDate: null,
    current: true,
    description:
      'Over the past two years, I have dedicated myself to mastering modern frontend development. Starting with HTML and CSS out of pure curiosity, I progressed through JavaScript and React, eventually diving into Three.js, GSAP, and AI-powered web applications. Each project has been a deliberate step toward building the kind of immersive, premium web experiences that I believe represent the future of the internet.',
    highlights: [
      'Built 7+ personal projects spanning games, AI tools, and 3D websites',
      'Mastered React, TypeScript, Three.js, and modern animation libraries',
      'Developed expertise in responsive design and performance optimization',
      'Created production-quality landing pages and brand experiences',
    ],
  },
];

/* ─── Services ───────────────────────────────────────────── */

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'srv-1',
    icon: 'frontend',
    title: 'Modern Frontend Development',
    description:
      'Building fast, accessible, and beautifully crafted web applications using React, TypeScript, and the latest frontend tooling. Every component is designed for reusability and every page is optimized for performance.',
  },
  {
    id: 'srv-2',
    icon: '3d',
    title: '3D Interactive Websites',
    description:
      'Creating immersive three-dimensional web experiences with Three.js and React Three Fiber. From product configurators to full 3D landing pages that captivate and engage visitors.',
  },
  {
    id: 'srv-3',
    icon: 'landing',
    title: 'Landing Pages',
    description:
      'Designing high-converting, visually stunning landing pages that tell your brand story and drive action. Premium motion design paired with strategic layout and clear calls-to-action.',
  },
  {
    id: 'srv-4',
    icon: 'ai',
    title: 'AI Web Applications',
    description:
      'Integrating artificial intelligence into web interfaces — from conversational assistants to intelligent dashboards. Building the bridge between AI models and user-friendly experiences.',
  },
  {
    id: 'srv-5',
    icon: 'portfolio',
    title: 'Portfolio Websites',
    description:
      'Crafting personal portfolio sites that make a lasting impression. Cinematic animations, smooth interactions, and a design language that reflects your unique professional identity.',
  },
  {
    id: 'srv-6',
    icon: 'business',
    title: 'Business Websites',
    description:
      'Developing professional websites for businesses that need a strong online presence. Clean design, fast loading, and built to convert visitors into customers.',
  },
  {
    id: 'srv-7',
    icon: 'ui',
    title: 'Custom UI Development',
    description:
      'Building custom user interface components and design systems from scratch. Pixel-perfect implementation of complex interactions, animations, and responsive layouts.',
  },
];

/* ─── Projects ───────────────────────────────────────────── */

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
  featured: boolean;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Void Runner',
    category: 'Game Development',
    description:
      'A browser-based game built to improve my JavaScript logic and frontend development skills. Features real-time rendering, dynamic difficulty scaling, and a polished game loop that keeps players engaged.',
    tags: ['JavaScript', 'HTML5 Canvas', 'Game Logic', 'CSS3'],
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'GetLinkVault',
    category: 'Link Management Tool',
    description:
      'A clean and simple link vault to organize and manage important links in one place. Built with a focus on speed, simplicity, and ease of access.',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'Utility Tool'],
    liveUrl: 'https://ranarehan124.github.io/getlinkvault/',
    githubUrl: 'https://github.com/ranarehan124/getlinkvault',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'Vortex Energy',
    category: '3D Product Website',
    description:
      'A cinematic energy drink landing page with immersive visuals, animations, and premium UI. Built to push the boundaries of what a product page can feel like on the modern web.',
    tags: ['Three.js', 'GSAP', 'React', 'Premium UI'],
    liveUrl: 'https://asset-manager--rehan-77.replit.app/',
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'Voltx Energy',
    category: 'Interactive Brand Website',
    description:
      'A modern brand experience built with motion design and futuristic visuals. Smooth scroll-driven animations and a dark, high-contrast aesthetic create a memorable first impression.',
    tags: ['React', 'Framer Motion', 'TailwindCSS', 'Motion Design'],
    liveUrl: 'https://voltx-drink.lovable.app',
    featured: true,
  },
  {
    id: 'proj-5',
    title: 'RehanShare',
    category: 'Utility Platform',
    description:
      'A utility platform designed for sharing and managing content efficiently. Clean interface with focus on speed and usability.',
    tags: ['React', 'Node.js', 'MongoDB', 'Full Stack'],
    liveUrl: 'https://rehan.up.railway.app',
    featured: false,
  },
  {
    id: 'proj-6',
    title: 'Rehan Writes',
    category: 'Writing Platform',
    description:
      'A personal writing platform with a distraction-free editor and clean reading experience. Built with a focus on typography and content-first design.',
    tags: ['React', 'Markdown', 'TailwindCSS', 'Typography'],
    liveUrl: 'https://rehanwrites.up.railway.app',
    featured: false,
  },
  {
    id: 'proj-7',
    title: 'Nova Estates',
    category: 'Real Estate Website',
    description:
      'A modern real estate website featuring property listings, search functionality, and a professional layout designed to build trust with potential buyers.',
    tags: ['React', 'Responsive Design', 'UI/UX', 'CSS3'],
    liveUrl: 'https://nova-estates.space-z.ai',
    featured: false,
  },
];