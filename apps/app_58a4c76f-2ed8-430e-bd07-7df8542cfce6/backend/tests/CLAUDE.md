# Testing

Comprehensive tests using Vitest with automatic database setup.

## Structure

```
tests/
├── integration/              # API endpoint tests
│   └── __entity__.route.test.template.ts
├── e2e/                      # End-to-end tests
│   └── e2e.test.template.ts
├── unit/                     # Unit tests
│   └── __entity__.service.test.template.ts
├── helpers/                  # Test helpers
│   ├── build-app.ts          # App builder
│   └── db-reset.ts           # Database reset
├── __fixtures__/             # Test fixtures
└── vitest.setup.ts           # Test setup
```

## Test Layers

### Integration Tests (`integration/`)

- Test API endpoints
- Use Fastify app instance
- Database reset between tests

### E2E Tests (`e2e/`)

- End-to-end application tests
- Complete application workflows

### Unit Tests (`unit/`)

- Individual functions and classes
- Isolated testing with mocks

## Test Configuration

- Uses separate `.env.test` file
- Automatic database setup/teardown
- Template tests work out of the box

## Running Tests

```bash
pnpm test                    # Run all tests
pnpm run test:watch         # Watch mode
pnpm run coverage           # Coverage report
```

## Template Testing

Template files should be copied before modification:

```bash
pnpm test tests/integration/__entity__.route.test.template.ts
```

## Example Test

```typescript
// tests/integration/__entity__.route.test.template.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../helpers/build-app';
import { resetDb } from '../helpers/db-reset';

describe('__entity__ routes (integration)', () => {
  const app = buildApp();

  beforeAll(async () => {
    await resetDb(app);
  });

  it('GET /__entityPlural__ returns [] when table empty', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/__entityPlural__',
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });
});
```
