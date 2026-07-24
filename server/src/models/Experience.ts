import mongoose, { Schema, type Document } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  highlights: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, required: true, trim: true },
    highlights: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

experienceSchema.index({ order: 1 });

export const ExperienceModel = mongoose.model<IExperience>(
  'Experience',
  experienceSchema,
);