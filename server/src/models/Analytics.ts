import mongoose, { Schema, type Document } from 'mongoose';

export interface IAnalytics extends Document {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  contactSubmissions: number;
  projectClicks: number;
  topPages: Array<{ path: string; views: number }>;
  topReferrers: Array<{ source: string; count: number }>;
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid ISO date string'],
    },
    pageViews: { type: Number, min: 0, default: 0 },
    uniqueVisitors: { type: Number, min: 0, default: 0 },
    contactSubmissions: { type: Number, min: 0, default: 0 },
    projectClicks: { type: Number, min: 0, default: 0 },
    topPages: [
      {
        path: { type: String, required: true },
        views: { type: Number, min: 0, default: 0 },
      },
    ],
    topReferrers: [
      {
        source: { type: String, required: true },
        count: { type: Number, min: 0, default: 0 },
      },
    ],
  },
  { timestamps: true },
);

analyticsSchema.index({ date: -1 });

export const AnalyticsModel = mongoose.model<IAnalytics>(
  'Analytics',
  analyticsSchema,
);