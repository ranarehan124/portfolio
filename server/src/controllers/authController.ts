import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { AdminModel, RefreshTokenModel } from '../models/index.js';
import { JWT } from '../config/index.js';
import type { AuthRequest } from '../middleware/auth.js';

function generateTokens(payload: { id: string; email: string; role: string }, secret: string) {
  const accessToken = jwt.sign(payload, secret, { expiresIn: JWT.expire as jwt.SignOptions['expiresIn'] });
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return { accessToken, refreshToken };
}

async function storeRefreshToken(
  adminId: string,
  token: string,
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await RefreshTokenModel.create({ token, adminId, expiresAt });
}

async function revokeRefreshToken(token: string): Promise<void> {
  await RefreshTokenModel.deleteOne({ token });
}

async function revokeAllRefreshTokens(adminId: string): Promise<void> {
  await RefreshTokenModel.deleteMany({ adminId });
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body;

    const admin = await AdminModel.findOne({ email, isActive: true });
    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const secret = JWT.secret;
    if (!secret) {
      res.status(500).json({ success: false, message: 'Server configuration error' });
      return;
    }

    const payload = { id: admin._id.toString(), email: admin.email, role: admin.role };
    const { accessToken, refreshToken } = generateTokens(payload, secret);

    await revokeAllRefreshTokens(admin._id.toString());
    await storeRefreshToken(admin._id.toString(), refreshToken);

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });

    res.json({
      success: true,
      data: {
        token: accessToken,
        refreshToken,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          lastLogin: admin.lastLogin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingToken) {
      res.status(401).json({ success: false, message: 'Refresh token is required' });
      return;
    }

    const stored = await RefreshTokenModel.findOneAndDelete({
      token: incomingToken,
      expiresAt: { $gt: new Date() },
    });
    if (!stored) {
      res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
      return;
    }

    const admin = await AdminModel.findById(stored.adminId).select('-password');
    if (!admin || !admin.isActive) {
      res.status(401).json({ success: false, message: 'Admin account not found or deactivated' });
      return;
    }

    const secret = JWT.secret;
    if (!secret) {
      res.status(500).json({ success: false, message: 'Server configuration error' });
      return;
    }

    const payload = { id: admin._id.toString(), email: admin.email, role: admin.role };
    const { accessToken, refreshToken } = generateTokens(payload, secret);

    await storeRefreshToken(admin._id.toString(), refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });

    res.json({
      success: true,
      data: { token: accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
}

export async function validateToken(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  res.json({
    success: true,
    data: {
      id: req.user?.id,
      email: req.user?.email,
      role: req.user?.role,
    },
  });
}

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const admin = await AdminModel.findById(req.user?.id).select('-password');
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const allowedFields: string[] = ['name', 'email'];
    const updateData: Record<string, string> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ success: false, message: 'No valid fields to update' });
      return;
    }

    const admin = await AdminModel.findByIdAndUpdate(
      req.user?.id,
      updateData,
      { new: true, runValidators: true },
    ).select('-password');

    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await AdminModel.findById(req.user?.id);
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Current password is incorrect' });
      return;
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    await revokeAllRefreshTokens(admin._id.toString());

    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    res.clearCookie(JWT.cookieName);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}