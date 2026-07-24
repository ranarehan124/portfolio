export interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'tools'
  | 'design'
  | 'other';

export interface Skill {
  _id: string;
  name: string;
  category: SkillCategory;
  icon?: string;
  level: number;
  featured: boolean;
  order: number;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  highlights: string[];
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

export interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description?: string;
  grade?: string;
  image?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AboutContent {
  _id: string;
  name: string;
  title: string;
  bio: string;
  longBio?: string;
  avatar?: string;
  resumeUrl?: string;
  dateOfBirth?: string;
  location?: string;
  email?: string;
  phone?: string;
  stats?: Array<{ label: string; value: string; suffix?: string }>;
  updatedAt: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  features: string[];
  order: number;
}

export interface WebsiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  email: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  maintenanceMode: boolean;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalExperience: number;
  totalServices: number;
  totalTestimonials: number;
  totalCertificates: number;
  totalEducation: number;
  totalMessages: number;
  unreadMessages: number;
  recentMessages: ContactMessage[];
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
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AppTheme {
  mode: 'dark';
}

export interface CursorVariant {
  variant: 'default' | 'hover' | 'text' | 'hidden';
}

export interface AnimationConfig {
  ease: number[];
  duration: Record<string, number>;
  stagger: number;
}