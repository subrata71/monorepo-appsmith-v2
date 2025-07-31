import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { envSchema } from '../config/env.schema.js';
import * as schema from '../db/schema.js';

// Extract the config type from the schema
type EnvConfig = {
  [K in keyof typeof envSchema.properties]: string;
};

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvConfig;
    db: NodePgDatabase<typeof schema>;
    repositories: Repositories;
    services: Services;
  }
}
