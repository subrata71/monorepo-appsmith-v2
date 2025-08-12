import { FastifyInstance } from 'fastify';
import healthRoutes from './health.route.js';
import { isTestEnvironment } from '../utils/env.js';
import { constants } from '../constants/index.js';

// Import template routes for testing
let entityTemplateRoutes: any = null;
if (isTestEnvironment()) {
  entityTemplateRoutes = await import('./__entity__.route.template.js');
}

// Create a plugin that registers all routes without prefix
async function allRoutesPlugin(app: FastifyInstance) {
  await app.register(healthRoutes);

  if (isTestEnvironment() && entityTemplateRoutes) {
    await app.register(entityTemplateRoutes.default);
  }
}

export async function registerRoutes(app: FastifyInstance) {
  await app.register(allRoutesPlugin, { prefix: constants.API_PREFIX });
}

// Export individual route functions for direct use if needed
export { healthRoutes };
