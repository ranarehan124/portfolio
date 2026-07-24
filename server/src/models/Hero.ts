import mongoose, { Schema, type Document } from 'mongoose';

export interface IHero extends Document {
  greeting: string;
  name: string;
  titles: string[];
  tagline: string;
  resumeUrl?: string;
  updatedAt: Date;
}

const heroSchema = new Schema<IHero>(
  {
    greeting: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    titles: [{ type: String, required: true, trim: true }],
    tagline: { type: String, required: true, trim: true },
    resumeUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

export const HeroModel = mongoose.model<IHero>('Hero', heroSchema);