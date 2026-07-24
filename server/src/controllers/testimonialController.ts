import type { Request, Response, NextFunction } from 'express';
import { TestimonialModel } from '../models/index.js';
import { paginate } from '../services/index.js';

export async function getTestimonials(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await paginate(
      TestimonialModel,
      req,
      { isActive: true },
      ['name', 'role', 'company', 'content'],
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getTestimonialById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const testimonial = await TestimonialModel.findById(req.params.id);
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
}

export async function createTestimonial(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const testimonial = await TestimonialModel.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
}

export async function updateTestimonial(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const testimonial = await TestimonialModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
}

export async function deleteTestimonial(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const testimonial = await TestimonialModel.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
}