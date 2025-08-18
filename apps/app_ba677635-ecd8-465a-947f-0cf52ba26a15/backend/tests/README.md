# Testing

This directory contains comprehensive tests for the application using Vitest.

## Structure

```
tests/
├── integration/              # API endpoint tests
│   └── __entity__.route.test.template.ts
├── e2e/                      # End-to-end application tests
│   └── e2e.test.template.ts
├── unit/                     # Unit tests
│   └── __entity__.service.test.template.ts
├── helpers/                  # Test helpers
│   ├── build-app.ts          # App builder for tests
│   └── db-reset.ts           # Database reset utility
├── __fixtures__/             # Test fixtures
└── vitest.setup.ts           # Test setup configuration
```

## Test Layers

### Integration Tests (`integration/`)
- Test API endpoints
- Use Fastify app instance
- Test full request/response cycle
- Database reset between tests

### E2E Tests (`e2e/`)
- End-to-end application tests
- Test complete user workflows
- Full application lifecycle

### Unit Tests (`unit/`)
- Test individual functions and classes
- Isolated testing
- Mock dependencies

### Test Helpers (`helpers/`)
- Shared test utilities
- Database reset functionality
- App builder for consistent testing

## Test Configuration

### Environment
- Uses separate `.env.test` file
- Automatic database setup/teardown
- Template tests work out of the box

### Database Setup
- Test database: configurable via `APP_DATABASE_URL`
- Automatic migrations on test setup
- Database reset between tests

## Running Tests

```bash
pnpm test                    # Run all tests
pnpm run test:watch         # Run tests in watch mode
pnpm run test:setup         # Setup test database
pnpm run coverage           # Generate coverage report
```

## Template Testing

Template files can be tested directly without copying:
```bash
pnpm test tests/integration/__entity__.route.test.template.ts
```

## Test Database Requirements

The test environment comes with a pre-configured `.env.test` file. Ensure the database user has privileges to create databases.

## Example Test

```typescript
// tests/integration/__entity__.route.test.template.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { buildApp } from '../helpers/build-app'
import { resetDb } from '../helpers/db-reset'

describe('__entity__ routes (integration)', () => {
  const app = buildApp()
  
  beforeAll(async () => {
    await resetDb(app)
  })
  
  it('GET /api/v1/__entityPlural__ returns [] when table empty', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/__entityPlural__',
    })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual([])
  })
})
``` 