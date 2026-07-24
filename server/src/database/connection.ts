import mongoose from 'mongoose';
import { DB, ENV } from '../config/index.js';

export async function connectDatabase(): Promise<void> {
  try {
    if (!DB.uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    mongoose.connection.on('connected', () => {
      console.log(`[MongoDB] Connected at ${new Date().toISOString()}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected');
    });

    await mongoose.connect(DB.uri);

    if (ENV.isDev) {
      mongoose.set('debug', true);
    }
  } catch (error) {
    console.error('[MongoDB] Failed to connect:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected gracefully');
  } catch (error) {
    console.error('[MongoDB] Disconnect error:', error);
  }
}

export default connectDatabase;