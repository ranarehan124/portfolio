import type { Request, Response, NextFunction } from 'express';

interface ValidationError {
  field: string;
  message: string;
}

export function validateBody(fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: ValidationError[] = [];

    for (const field of fields) {
      const value = req.body?.[field];
      if (value === undefined || value === null || value === '') {
        errors.push({ field, message: `${field} is required` });
      }
    }

    if (errors.length > 0) {
      return next(new Error(`Validation failed: ${errors.map((e) => e.message).join(', ')}`));
    }

    next();
  };
}

export function validateEmail(email: string): boolean {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
}

export default validateBody;