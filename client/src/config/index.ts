export const APP_CONFIG = {
  name: 'Rehan Tahir Portfolio',
  description:
    'Premium portfolio website for Rehan Tahir — Creative Frontend Developer & AI Builder',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  cloudinaryCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  cloudinaryUploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
} as const;

export const THEME_CONFIG = {
  colors: {
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',
    accent: '#60A5FA',
    accentLight: '#93C5FD',
    dark: '#0A0A0A',
    darkSecondary: '#111113',
  },
  fonts: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
} as const;