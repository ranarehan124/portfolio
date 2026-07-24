import type { Request, Response, NextFunction } from 'express';
import { ExperienceModel } from '../models/index.js';
import { paginate } from '../services/index.js';

export async function getExperiences(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await paginate(
      ExperienceModel,
      req,
      {},
      ['company', 'role', 'location', 'description'],
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getExperienceById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const experience = await ExperienceModel.findById(req.params.id);
    if (!experience) {
      res.status(404).json({ success: false, message: 'Experience not found' });
      return;
    }
    res.json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
}

export async function createExperience(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const experience = await ExperienceModel.create(req.body);
    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
}

export async function updateExperience(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const experience = await ExperienceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!experience) {
      res.status(404).json({ success: false, message: 'Experience not found' });
      return;
    }
    res.json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
}

export async function deleteExperience(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const experience = await ExperienceModel.findByIdAndDelete(
      req.params.id,
    );
    if (!experience) {
      res.status(404).json({ success: false, message: 'Experience not found' });
      return;
    }
    res.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    next(error);
  }
}