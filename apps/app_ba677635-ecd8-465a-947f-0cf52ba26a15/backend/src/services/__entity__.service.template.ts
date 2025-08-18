/* TEMPLATE  –  Service factory for <Entity>
   After scaffolding:
     1. Copy  →  src/services/user.service.ts
     2. Replace tokens  (__entity__ → user, etc.)
*/

import { __entity__Repo } from '../repositories/__entity__.repo.template.js';
import { __Entity__, New__Entity__ } from '../db/schema.js';
import { FastifyInstance } from 'fastify';

export function make__Entity__Service(app: FastifyInstance) {
  const repo = app.repositories.__entity__ ?? __entity__Repo(app.db as any);

  return {
    list: () => repo.findAll(),

    async get(id: string) {
      const found = await repo.findById(id);
      if (!found) throw new Error('<Entity> not found');
      return found;
    },

    create: (data: New__Entity__) => repo.create(data),

    update: (id: string, changes: Partial<__Entity__>) =>
      repo.update(id, changes),

    remove: (id: string) => repo.delete(id),
  };
}
export type __Entity__Service = ReturnType<typeof make__Entity__Service>;
