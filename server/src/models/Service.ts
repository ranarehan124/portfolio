import mongoose, { Schema, type Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  icon?: string;
  features: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    features: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

serviceSchema.index({ order: 1 });
serviceSchema.index({ isActive: 1 });

export const ServiceModel = mongoose.model<IService>('Service', serviceSchema);