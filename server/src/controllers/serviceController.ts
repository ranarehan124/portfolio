import type { Request, Response, NextFunction } from 'express';
import { ServiceModel } from '../models/index.js';
import { paginate } from '../services/index.js';

export async function getServices(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await paginate(
      ServiceModel,
      req,
      { isActive: true },
      ['title', 'description'],
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function createService(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const service = await ServiceModel.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
}

export async function getServiceById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const service = await ServiceModel.findById(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
}

export async function updateService(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const service = await ServiceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
}

export async function deleteService(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const service = await ServiceModel.findByIdAndDelete(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
}