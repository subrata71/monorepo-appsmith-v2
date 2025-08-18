import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import configPlugin from '@fastify/env';
import staticPlugin from '@fastify/static';
import { envSchema } from './config/env.schema.js';
import fs from 'node:fs/promises';
import { buildPlugins } from './plugins/index.js';
import { buildRepositories } from './repositories/index.js';
import { buildServices } from './services/index.js';
import { registerRoutes } from './routes/index.js';

import { loggerOptions } from './utils/logger.js';
import registerHooks from './hooks/index.js';
import { constants } from './constants/index.js';

export default async function build(): Promise<FastifyInstance> {
  const app = Fastify({ logger: loggerOptions });

  try {
    await app.register(configPlugin, {
      schema: envSchema,
      dotenv: true,
    });

    await setupStaticIfAvailable(app);

    app.decorate('plugins', buildPlugins(app));
    app.decorate('repositories', buildRepositories(app));
    app.decorate('services', buildServices(app));

    await registerHooks(app);

    // Register all routes using barrel pattern
    await registerRoutes(app);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }

  return app;
}

async function setupStaticIfAvailable(app: FastifyInstance) {
  // Serve static files from the public directory (frontend build) only if it exists
  try {
    await fs.access('./public/index.html');
  } catch (err) {
    // No public folder, ignore.
    return;
  }

  await app.register(staticPlugin, {
    root: process.cwd() + '/public',
    prefix: '/',
  });

  // SPA fallback: serve index.html for all non-API routes
  app.setNotFoundHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const apiPrefixPattern = new RegExp(
        `^${constants.API_PREFIX.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')}`
      );

      // Only serve index.html for GET requests that don't start with the API prefix
      if (request.method === 'GET' && !request.url.match(apiPrefixPattern)) {
        return reply.sendFile('index.html');
      }

      // For API routes or other methods, return 404
      return reply.code(404).send({ error: 'Not Found' });
    }
  );
}
