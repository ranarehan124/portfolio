import mongoose, { Schema, type Document } from 'mongoose';

export interface ISeoSettings extends Document {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType: string;
  twitterCard: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots: string;
  createdAt: Date;
  updatedAt: Date;
}

const seoSettingsSchema = new Schema<ISeoSettings>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 70,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    keywords: [{ type: String, trim: true, lowercase: true }],
    ogTitle: { type: String, trim: true, maxlength: 70 },
    ogDescription: { type: String, trim: true, maxlength: 160 },
    ogImage: { type: String, trim: true },
    ogType: {
      type: String,
      enum: ['website', 'article', 'profile'],
      default: 'website',
    },
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image'],
      default: 'summary_large_image',
    },
    twitterTitle: { type: String, trim: true, maxlength: 70 },
    twitterDescription: { type: String, trim: true, maxlength: 160 },
    twitterImage: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    robots: {
      type: String,
      default: 'index, follow',
      trim: true,
    },
  },
  { timestamps: true },
);

export const SeoSettingsModel = mongoose.model<ISeoSettings>(
  'SeoSettings',
  seoSettingsSchema,
);