import { seedAdmin } from './index.js';

export async function seedDatabase(): Promise<void> {
  await seedAdmin();
  console.log('Database seeding completed');
}

export default seedDatabase;