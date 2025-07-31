import { describe, it, expect, vi } from 'vitest';
import { make__Entity__Service } from '../../src/services/__entity__.service.template.js';

/** Fake repo so we don’t touch the real DB */
const fakeRepo = {
  findAll: vi.fn().mockResolvedValue([{ id: '1', name: 'Alice' }]),
  create: vi.fn(),
  findById: vi.fn(),
};

// // very dumb Drizzle stub — just enough for list()
// const dbStub = {
//   select: () => ({
//     from: () => Promise.resolve([{ id: '1', name: 'Jane Doe' }]),
//   }),
// };

describe('__Entity__Service (unit)', () => {
  const appStub: any = {
    repositories: { __entity__: fakeRepo },
    log: { child: () => ({}) },
  };
  const svc = make__Entity__Service(appStub);

  it('lists users without hitting the DB', async () => {
    const users = await svc.list();
    expect(users).toHaveLength(1);
    expect(fakeRepo.findAll).toHaveBeenCalled();
  });
});
