import mongoose, { Schema, type Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'superadmin';
  refreshToken?: string;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    refreshToken: { type: String, default: null },
    lastLogin: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

adminSchema.index({ email: 1 });
adminSchema.index({ refreshToken: 1 });

export const AdminModel = mongoose.model<IAdmin>('Admin', adminSchema);