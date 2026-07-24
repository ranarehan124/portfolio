import mongoose, { Schema, type Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  resumeUrl?: string;
  showResumeButton: boolean;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    siteDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    siteUrl: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: { type: String, trim: true },
    faviconUrl: { type: String, trim: true },
    primaryColor: {
      type: String,
      required: true,
      match: [/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'],
      default: '#8B5CF6',
    },
    accentColor: {
      type: String,
      required: true,
      match: [/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'],
      default: '#60A5FA',
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactPhone: { type: String, trim: true },
    address: { type: String, trim: true, maxlength: 300 },
    resumeUrl: { type: String, trim: true },
    showResumeButton: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const SettingsModel = mongoose.model<ISettings>(
  'Settings',
  settingsSchema,
);