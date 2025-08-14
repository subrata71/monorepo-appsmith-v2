// ---------------------------------------------------------------------------
// services/index.ts
// ---------------------------------------------------------------------------
// During the template phase:
//   • It exports an empty object so TypeScript compiles even before you
//     scaffold a real service.
// After scaffolding your first entity (e.g. user):
//   1. Copy __entity__.service.template.ts → user.service.ts
//   2. Replace tokens inside
//   3. Uncomment + append a line below:  user: makeUserService(app),
// ---------------------------------------------------------------------------

import type { FastifyInstance } from 'fastify';
import { DailyEntryService } from './daily-entry.service';
import { DailyEntryRepository } from '../repositories/daily-entry.repo';

// ⬇️  Import service factories here as you create them
import { make__Entity__Service } from './__entity__.service.template';
// import { makeUserService }      from './user.service.ts'
// import { makeOrderService }     from './order.service.ts'

const makeDailyEntryService = (app: FastifyInstance) => {
  const dailyEntryRepo = new DailyEntryRepository(app.db);
  return new DailyEntryService(dailyEntryRepo);
};

export const buildServices = (app: FastifyInstance) => ({
  __entity__: make__Entity__Service(app), // placeholder entry
  dailyEntry: makeDailyEntryService(app),
  // user:  makeUserService(app),
  // order: makeOrderService(app),
});

export type Services = ReturnType<typeof buildServices>;
