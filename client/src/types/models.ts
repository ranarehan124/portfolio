/* Project type definitions */

export interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  images?: string[];
  tags: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: SkillCategory;
  icon?: string;
  level: number;
  featured: boolean;
  order: number;
}

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'tools'
  | 'design'
  | 'other';

export interface Experience {
  _id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  highlights?: string[];
  order: number;
}

export interface HeroContent {
  _id: string;
  greeting: string;
  name: string;
  titles: string[];
  tagline: string;
  resumeUrl?: string;
  updatedAt: string;
}

export interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  icon?: string;
  order: number;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
  featured: boolean;
  order: number;
}

export interface Achievement {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  date?: string;
  order: number;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
  order: number;
}

export interface TechStackItem {
  _id: string;
  name: string;
  icon: string;
  category: string;
  url?: string;
  order: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}