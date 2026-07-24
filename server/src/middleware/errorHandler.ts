import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(`[Error] ${err.message}`);

  if ('statusCode' in err && typeof err.statusCode === 'number') {
    res.status(err.statusCode).json({
      success: false,
      message:
        (err as { statusCode: number }).statusCode === 500
          ? 'Internal server error'
          : err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}