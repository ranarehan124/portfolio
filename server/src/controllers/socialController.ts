import type { Request, Response, NextFunction } from 'express';
import { SocialModel } from '../models/index.js';

export async function getSocials(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const socials = await SocialModel.find().sort({ order: 1 });
    res.json({ success: true, data: socials });
  } catch (error) {
    next(error);
  }
}

export async function createSocial(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const social = await SocialModel.create(req.body);
    res.status(201).json({ success: true, data: social });
  } catch (error) {
    next(error);
  }
}

export async function upsertSocial(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const social = await SocialModel.findOneAndUpdate(
      { platform: req.params.platform },
      req.body,
      { new: true, upsert: true, runValidators: true },
    );
    res.json({ success: true, data: social });
  } catch (error) {
    next(error);
  }
}

export async function updateSocial(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const social = await SocialModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!social) {
      res.status(404).json({ success: false, message: 'Social link not found' });
      return;
    }
    res.json({ success: true, data: social });
  } catch (error) {
    next(error);
  }
}

export async function deleteSocial(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const social = await SocialModel.findByIdAndDelete(req.params.id);
    if (!social) {
      res.status(404).json({ success: false, message: 'Social link not found' });
      return;
    }
    res.json({ success: true, message: 'Social link deleted' });
  } catch (error) {
    next(error);
  }
}