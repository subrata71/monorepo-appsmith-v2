# Shared API Contract

This directory contains the shared API contract using OpenAPI specifications with auto-generated TypeScript types.

## Structure

- `open-api-specs/` - Modular OpenAPI specifications by entity
  - `__entity__.ts` - Template for entity API specs
  - `index.js` - Combines all specs for type generation
- `api-types/` - TypeScript type definitions
  - `generated-types.d.ts` - Auto-generated from OpenAPI specs
  - `__entity__.d.ts` - Template for entity helper types
  - `common.d.ts` - Shared utility types
- `scripts/generate-types.ts` - Type generation script

## Workflow

### Adding New Entities

1. **Create OpenAPI spec**: Copy `open-api-specs/__entity__.ts` and add to `open-api-specs/index.js`
2. **Generate types**: Run `pnpm generate-types` from `shared` directory
3. **Create helper types**: Copy `api-types/__entity__.d.ts` and add to `api-types/index.ts`

### Type Generation

After updating OpenAPI specifications:

```bash
cd shared && pnpm generate-types
```

This regenerates `api-types/generated-types.d.ts` from the OpenAPI specs.

**Note**: `generated-types.d.ts` is auto-generated - do not modify manually.

## Usage

### Backend Routes

```typescript
import type { __Entity__Routes } from '../../../shared/api-types/__entity__.js';

app.get<__Entity__Routes.List>('/__entityPlural__', async () => {
  const entities = await svc.list();
  return {
    data: entities.map(e => ({ ...e, createdAt: e.createdAt.toISOString() })),
  };
});
```

## Benefits

- ✅ **Single Source of Truth** - OpenAPI specs define the API contract
- ✅ **Type Safety** - Compile-time checking across frontend and backend
- ✅ **Auto-generation** - Types always in sync with API specs
- ✅ **Tool Integration** - Works with Swagger UI, Postman, etc.
