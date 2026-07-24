import type { Request, Response, NextFunction } from 'express';
import { ProjectModel } from '../models/index.js';
import { paginate } from '../services/index.js';

export async function getProjects(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await paginate(
      ProjectModel,
      req,
      { featured: true },
      ['title', 'description', 'tags', 'category'],
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getAllProjects(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await paginate(
      ProjectModel,
      req,
      {},
      ['title', 'description', 'tags', 'category'],
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await ProjectModel.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await ProjectModel.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
}

export async function bulkDeleteProjects(
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
    const result = await ProjectModel.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${result.deletedCount} projects deleted` });
  } catch (error) {
    next(error);
  }
}