import mongoose, { Schema, type Document } from 'mongoose';

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'tools'
  | 'design'
  | 'other';

export interface ISkill extends Document {
  name: string;
  category: SkillCategory;
  icon?: string;
  level: number;
  featured: boolean;
  order: number;
}

const skillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'tools', 'design', 'other'],
      required: true,
    },
    icon: { type: String, trim: true },
    level: { type: Number, min: 0, max: 100, default: 50 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

skillSchema.index({ category: 1, order: 1 });

export const SkillModel = mongoose.model<ISkill>('Skill', skillSchema);