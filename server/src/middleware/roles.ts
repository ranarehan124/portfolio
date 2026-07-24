import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';

export function requireRoles(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredRole: roles,
        currentRole: req.user.role,
      });
      return;
    }

    next();
  };
}

export default requireRoles;