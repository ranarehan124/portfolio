import type { Request, Response, NextFunction } from 'express';
import { AboutModel } from '../models/index.js';

export async function getAbout(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let about = await AboutModel.findOne();
    if (!about) {
      about = await AboutModel.create({
        name: 'Rehan Tahir',
        title: 'Creative Frontend Developer',
        description: 'A passionate frontend developer crafting digital experiences.',
        country: 'Pakistan',
        city: 'Lahore',
        languages: ['English', 'Urdu'],
        yearsOfExperience: 2,
        availableForHire: true,
      });
    }
    res.json({ success: true, data: about });
  } catch (error) {
    next(error);
  }
}

export async function updateAbout(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const about = await AboutModel.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true },
    );
    res.json({ success: true, data: about });
  } catch (error) {
    next(error);
  }
}