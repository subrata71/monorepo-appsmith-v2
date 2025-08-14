import { runSeeds as runSeedsWithRunner } from './seed-runner';

export async function runSeeds() {
  console.log('🌱 Running database seeds');

  // Use the new seed runner that follows migration pattern
  await runSeedsWithRunner();
}
