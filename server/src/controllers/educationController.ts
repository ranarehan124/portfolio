import type { Request, Response, NextFunction } from 'express';
import { EducationModel } from '../models/index.js';
import { paginate } from '../services/index.js';

export async function getEducation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await paginate(
      EducationModel,
      req,
      { isActive: true },
      ['institution', 'degree', 'field'],
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getEducationById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const education = await EducationModel.findById(req.params.id);
    if (!education) {
      res.status(404).json({ success: false, message: 'Education not found' });
      return;
    }
    res.json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
}

export async function createEducation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const education = await EducationModel.create(req.body);
    res.status(201).json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
}

export async function updateEducation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const education = await EducationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!education) {
      res.status(404).json({ success: false, message: 'Education not found' });
      return;
    }
    res.json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
}

export async function deleteEducation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const education = await EducationModel.findByIdAndDelete(req.params.id);
    if (!education) {
      res.status(404).json({ success: false, message: 'Education not found' });
      return;
    }
    res.json({ success: true, message: 'Education deleted' });
  } catch (error) {
    next(error);
  }
}