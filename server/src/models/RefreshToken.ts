import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string;
  adminId: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true },
);

export const RefreshTokenModel = mongoose.model<IRefreshToken>(
  'RefreshToken',
  refreshTokenSchema,
);