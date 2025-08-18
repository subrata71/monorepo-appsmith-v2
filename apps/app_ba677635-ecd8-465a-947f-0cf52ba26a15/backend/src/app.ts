import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import configPlugin from '@fastify/env';
import staticPlugin from '@fastify/static';
import dbPlugin from './plugins/db.js';
import { envSchema } from './config/env.schema.js';
import fs from 'node:fs/promises';
import { buildRepositories } from './repositories/index.js';
import { buildServices } from './services/index.js';
import { registerRoutes } from './routes/index.js';

import { join } from 'node:path';
import { log, loggerOptions } from './utils/logger.js';
import registerHooks from './hooks/index.js';

export default async function build(): Promise<FastifyInstance> {
  const app = Fastify({ logger: loggerOptions });

  try {
    await app.register(configPlugin, {
      schema: envSchema,
      dotenv: true,
    });

    await app.register(dbPlugin);

    await setupStaticIfAvailable(app);

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
      // Only serve index.html for GET requests that don't start with /api/v1
      if (request.method === 'GET' && !request.url.match(/^\/api\/v1\b/)) {
        return reply.sendFile('index.html');
      }

      // For API routes or other methods, return 404
      return reply.code(404).send({ error: 'Not Found' });
    }
  );
}
