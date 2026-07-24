import path from 'node:path';
import dotenv from 'dotenv';
import type { CorsOptions } from 'cors';

dotenv.config();

export const ENV = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;

export const DB = {
  uri: process.env.MONGODB_URI || '',
} as const;

export const JWT = {
  secret: process.env.JWT_SECRET || '',
  expire: process.env.JWT_EXPIRE || '7d',
  refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  cookieName: process.env.JWT_COOKIE_NAME || 'portfolio_token',
} as const;

export const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@rehantahir.com',
  password: process.env.ADMIN_PASSWORD || '',
} as const;

export const CLOUDINARY = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  folder: process.env.CLOUDINARY_FOLDER || 'portfolio',
} as const;

export const SMTP = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.EMAIL_FROM || 'noreply@rehantahir.com',
  to: process.env.EMAIL_TO || '',
} as const;

export const CORS = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
} as const satisfies CorsOptions;

export const RATE_LIMIT = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
} as const;

export const UPLOADS_DIR = path.resolve(process.cwd(), 'src/uploads');