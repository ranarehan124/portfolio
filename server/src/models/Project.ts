import mongoose, { Schema, type Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, trim: true },
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
    tags: [{ type: String, trim: true }],
    category: { type: String, required: true, trim: true },
    liveUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

projectSchema.index({ order: 1 });
projectSchema.index({ featured: 1 });

export const ProjectModel = mongoose.model<IProject>('Project', projectSchema);