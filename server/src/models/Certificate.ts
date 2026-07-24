import mongoose, { Schema, type Document } from 'mongoose';

export interface ICertificate extends Document {
  title: string;
  issuer: string;
  description?: string;
  certificateUrl?: string;
  badgeUrl?: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    certificateUrl: { type: String, trim: true },
    badgeUrl: { type: String, trim: true },
    issueDate: { type: String, required: true },
    expiryDate: { type: String },
    credentialId: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

certificateSchema.index({ order: 1 });
certificateSchema.index({ isActive: 1 });

export const CertificateModel = mongoose.model<ICertificate>(
  'Certificate',
  certificateSchema,
);