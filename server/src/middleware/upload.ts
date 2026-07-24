import multer from 'multer';
import type { Request } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { UPLOADS_DIR } from '../config/index.js';

const imagesDir = path.join(UPLOADS_DIR, 'images');
const resumesDir = path.join(UPLOADS_DIR, 'resumes');

[imagesDir, resumesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const memoryStorage = multer.memoryStorage();

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, resumesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  const allowed = /jpeg|jpg|png|gif|webp|svg\+xml/;
  const extOk = allowed.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
}

function resumeFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  const allowed = /pdf|doc|docx/;
  const extOk = allowed.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimeOk =
    file.mimetype === 'application/pdf' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOC files are allowed'));
  }
}

export const uploadImage = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadImages = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});