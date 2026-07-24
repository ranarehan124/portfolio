import type { Request, Response, NextFunction } from 'express';
import { HeroModel } from '../models/index.js';

export async function getHero(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let hero = await HeroModel.findOne();
    if (!hero) {
      hero = await HeroModel.create({
        greeting: "Hello, I'm",
        name: 'Rehan Tahir',
        titles: [
          'Creative Frontend Developer',
          'AI Builder',
          'Interactive Web Experiences',
        ],
        tagline:
          'Crafting digital experiences that leave a lasting impression',
      });
    }
    res.json({ success: true, data: hero });
  } catch (error) {
    next(error);
  }
}

export async function updateHero(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const hero = await HeroModel.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true },
    );
    res.json({ success: true, data: hero });
  } catch (error) {
    next(error);
  }
}