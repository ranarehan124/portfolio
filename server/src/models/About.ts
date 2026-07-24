import mongoose, { Schema, type Document } from 'mongoose';

export interface IAbout extends Document {
  name: string;
  title: string;
  description: string;
  longDescription?: string;
  profileImage?: string;
  age: number;
  country: string;
  city: string;
  languages: string[];
  yearsOfExperience: number;
  availableForHire: boolean;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const aboutSchema = new Schema<IAbout>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, trim: true },
    profileImage: { type: String, trim: true },
    age: { type: Number, min: 0, max: 150 },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    languages: [{ type: String, trim: true }],
    yearsOfExperience: { type: Number, min: 0, default: 0 },
    availableForHire: { type: Boolean, default: true },
    resumeUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

export const AboutModel = mongoose.model<IAbout>('About', aboutSchema);