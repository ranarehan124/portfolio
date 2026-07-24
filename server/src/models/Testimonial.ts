import mongoose, { Schema, type Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
  featured: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    avatar: { type: String, trim: true },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

testimonialSchema.index({ order: 1 });
testimonialSchema.index({ featured: 1 });
testimonialSchema.index({ isActive: 1 });
testimonialSchema.index({ rating: -1 });

export const TestimonialModel = mongoose.model<ITestimonial>(
  'Testimonial',
  testimonialSchema,
);