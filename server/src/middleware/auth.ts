import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { AdminModel } from '../models/index.js';
import { JWT } from '../config/index.js';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  const token = header.split(' ')[1] as string;
  const secret = JWT.secret;

  if (!secret) {
    res
      .status(500)
      .json({ success: false, message: 'Server configuration error' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as unknown as {
      id: string;
      email: string;
      role: string;
    };

    void AdminModel.findById(decoded.id)
      .select('-password')
      .then((admin) => {
        if (!admin) {
          res
            .status(401)
            .json({ success: false, message: 'Admin not found' });
          return;
        }
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };
        next();
      })
      .catch(() => {
        res
          .status(401)
          .json({ success: false, message: 'Invalid or expired token' });
      });
  } catch {
    res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
}

export default requireAuth;