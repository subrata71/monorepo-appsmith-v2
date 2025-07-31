/* ---------------------------------------------------------------------------
   services/index.ts
   ---------------------------------------------------------------------------
   During the template phase:
     • It exports an empty object so TypeScript compiles even before you
       scaffold a real service.
   After scaffolding your first entity (e.g. user):
     1. Copy __entity__.service.template.ts → user.service.ts
     2. Replace tokens inside
     3. Uncomment + append a line below:  user: makeUserService(app),
 --------------------------------------------------------------------------- */

import { FastifyInstance } from 'fastify';

// ⬇️  Import service factories here as you create them
import { make__Entity__Service } from './__entity__.service.template.js';
import { treeService } from './tree.service.js';

export const buildServices = (app: FastifyInstance) => ({
  __entity__: make__Entity__Service(app), // placeholder entry
  tree: treeService(app),
});

export type Services = ReturnType<typeof buildServices>;
