import { runSeeds as runSeedsWithRunner } from './seed-runner.js';
import { getEnvironment, isProductionEnvironment } from '../utils/env.js';

// Environment-based seeding configuration
interface SeedConfig {
  enabled: boolean;
  environment: string;
}

function getSeedConfig(): SeedConfig {
  const env = getEnvironment();

  return {
    enabled: !isProductionEnvironment(), // Disable seeding in production by default
    environment: env,
  };
}

export async function runSeeds() {
  const config = getSeedConfig();

  console.log(
    `🌱 Running database seeds for environment: ${config.environment}`
  );

  if (!config.enabled) {
    console.log('⏭️  Seeding disabled for this environment');
    return;
  }

  // Use the new seed runner that follows migration pattern
  await runSeedsWithRunner();
}
