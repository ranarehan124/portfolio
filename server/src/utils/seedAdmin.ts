import bcrypt from 'bcryptjs';
import { AdminModel } from '../models/index.js';
import { ADMIN } from '../config/index.js';

export async function seedAdmin(): Promise<void> {
  try {
    const existingAdmin = await AdminModel.findOne({ email: ADMIN.email });
    if (existingAdmin) {
      console.log('[Seed] Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN.password, 12);
    await AdminModel.create({
      email: ADMIN.email,
      password: hashedPassword,
      name: 'Rehan Tahir',
      role: 'superadmin',
    });

    console.log('[Seed] Admin user created successfully');
  } catch (error) {
    console.error('[Seed] Failed to create admin:', error);
  }
}