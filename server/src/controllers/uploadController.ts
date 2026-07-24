import type { Request, Response, NextFunction } from 'express';
import { uploadImage, uploadMultipleImages, deleteImage } from '../services/index.js';

export async function uploadSingleImage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      res
        .status(400)
        .json({ success: false, message: 'No file uploaded' });
      return;
    }

    const result = await uploadImage(req.file.buffer);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function uploadMultiple(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) {
      res
        .status(400)
        .json({ success: false, message: 'No files uploaded' });
      return;
    }

    const buffers = files.map((f) => f.buffer);
    const results = await uploadMultipleImages(buffers);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
}

export async function removeImage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      res
        .status(400)
        .json({ success: false, message: 'Public ID is required' });
      return;
    }

    await deleteImage(publicId);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
}