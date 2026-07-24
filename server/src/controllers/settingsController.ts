import type { Request, Response, NextFunction } from 'express';
import { SettingsModel, SeoSettingsModel } from '../models/index.js';

export async function getSettings(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = await SettingsModel.create({
        siteName: 'Rehan Tahir',
        siteDescription: 'Creative Frontend Developer & AI Builder',
        siteUrl: 'https://rehantahir.com',
        primaryColor: '#8B5CF6',
        accentColor: '#60A5FA',
        contactEmail: 'rehan@rehantahir.com',
      });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const settings = await SettingsModel.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true },
    );
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export async function getSeo(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let seo = await SeoSettingsModel.findOne();
    if (!seo) {
      seo = await SeoSettingsModel.create({
        title: 'Rehan Tahir — Creative Frontend Developer & AI Builder',
        description:
          'Portfolio of Rehan Tahir — a creative frontend developer specializing in interactive web experiences, React, Three.js, and AI-powered applications.',
        keywords: [
          'Rehan Tahir',
          'Frontend Developer',
          'React Developer',
          'Three.js',
          'Portfolio',
          'Lahore',
          'Pakistan',
        ],
      });
    }
    res.json({ success: true, data: seo });
  } catch (error) {
    next(error);
  }
}

export async function updateSeo(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const seo = await SeoSettingsModel.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true },
    );
    res.json({ success: true, data: seo });
  } catch (error) {
    next(error);
  }
}