import mongoose, { Schema, type Document } from 'mongoose';

export interface IEducation extends Document {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  description?: string;
  logoUrl?: string;
  grade?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<IEducation>(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, required: true, trim: true },
    startYear: {
      type: String,
      required: true,
      match: [/^\d{4}$/, 'Must be a valid year'],
    },
    endYear: {
      type: String,
      required: true,
      match: [/^\d{4}$|^Present$/i, 'Must be a valid year or "Present"'],
    },
    description: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    grade: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

educationSchema.index({ order: 1 });
educationSchema.index({ isActive: 1 });

export const EducationModel = mongoose.model<IEducation>(
  'Education',
  educationSchema,
);