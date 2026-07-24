import type { Request, Response, NextFunction } from 'express';
import { SkillModel } from '../models/index.js';
import { paginate } from '../services/index.js';

export async function getSkills(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await paginate(
      SkillModel,
      req,
      { featured: true },
      ['name'],
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getAllSkills(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await paginate(
      SkillModel,
      req,
      {},
      ['name'],
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function createSkill(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const skill = await SkillModel.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
}

export async function updateSkill(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const skill = await SkillModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!skill) {
      res.status(404).json({ success: false, message: 'Skill not found' });
      return;
    }
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
}

export async function deleteSkill(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const skill = await SkillModel.findByIdAndDelete(req.params.id);
    if (!skill) {
      res.status(404).json({ success: false, message: 'Skill not found' });
      return;
    }
    res.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    next(error);
  }
}

export async function bulkDeleteSkills(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: 'ids array is required' });
      return;
    }
    const result = await SkillModel.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${result.deletedCount} skills deleted` });
  } catch (error) {
    next(error);
  }
}