import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import healthRoutes from './health.route';
import { dailyEntryRoutes } from './daily-entry.route';
import { isTestEnvironment } from '../utils/env';
import { constants } from '../constants/index';

// Import template routes for testing
let entityTemplateRoutes: {
  default: (app: FastifyInstance, opts: FastifyPluginOptions) => Promise<void>;
} | null = null;
if (isTestEnvironment()) {
  entityTemplateRoutes = await import('./__entity__.route.template');
}

// Create a plugin that registers all routes without prefix
async function allRoutesPlugin(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(dailyEntryRoutes);

  if (isTestEnvironment() && entityTemplateRoutes) {
    await app.register(entityTemplateRoutes.default);
  }
}

export async function registerRoutes(app: FastifyInstance) {
  await app.register(allRoutesPlugin, { prefix: constants.API_PREFIX });
}

// Export individual route functions for direct use if needed
export { healthRoutes, dailyEntryRoutes };
