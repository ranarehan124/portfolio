import type { Request, Response, NextFunction } from 'express';
import { CertificateModel } from '../models/index.js';
import { paginate } from '../services/index.js';

export async function getCertificates(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await paginate(
      CertificateModel,
      req,
      { isActive: true },
      ['title', 'issuer', 'credentialId'],
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getCertificateById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const certificate = await CertificateModel.findById(req.params.id);
    if (!certificate) {
      res.status(404).json({ success: false, message: 'Certificate not found' });
      return;
    }
    res.json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
}

export async function createCertificate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const certificate = await CertificateModel.create(req.body);
    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
}

export async function updateCertificate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const certificate = await CertificateModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!certificate) {
      res.status(404).json({ success: false, message: 'Certificate not found' });
      return;
    }
    res.json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
}

export async function deleteCertificate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const certificate = await CertificateModel.findByIdAndDelete(req.params.id);
    if (!certificate) {
      res.status(404).json({ success: false, message: 'Certificate not found' });
      return;
    }
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (error) {
    next(error);
  }
}