import mongoose, { Schema, type Document } from 'mongoose';

export interface ISocial extends Document {
  platform: string;
  url: string;
  icon?: string;
  order: number;
}

const socialSchema = new Schema<ISocial>(
  {
    platform: { type: String, required: true, trim: true, unique: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

socialSchema.index({ order: 1 });

export const SocialModel = mongoose.model<ISocial>('Social', socialSchema);