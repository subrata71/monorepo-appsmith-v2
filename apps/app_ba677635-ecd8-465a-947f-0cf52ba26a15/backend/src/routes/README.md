# Routes Layer

This directory contains API route handlers using Fastify with barrel pattern organization.

## Structure

```
routes/
├── index.ts                    # Barrel exports for routes
├── health.route.ts             # Health check endpoint
└── __entity__.route.template.ts # Route template
```

## Key Patterns

### Barrel Pattern
- All routes exported through `index.ts`
- Clean imports: `import { healthRoutes } from './routes'`
- Public API pattern: `export { ComponentName } from './ComponentName'`

### Route Organization
- All routes auto-prefixed with `/api/v1`
- Template files for consistent scaffolding
- Working tests for templates

### Template System
- Template files with `__entity__` and `__entityPlural__` placeholders
- Consistent patterns across entities
- Can be tested directly without copying

## Available Endpoints

### Health Check
- `GET /api/v1/health` - Health check endpoint (includes migration status)

### Template Endpoints
- `GET /api/v1/__entityPlural__` - List entities
- `POST /api/v1/__entityPlural__` - Create entity
- `GET /api/v1/__entityPlural__/:id` - Get entity by ID
- `PUT /api/v1/__entityPlural__/:id` - Update entity
- `DELETE /api/v1/__entityPlural__/:id` - Delete entity

## Response Format

```json
{
  "status": "ok",
  "data": [...],
  "timestamp": 1234567890
}
```

## Adding New Routes

1. **Use Template**: Copy `__entity__.route.template.ts`
2. **Replace Placeholders**: 
   - `__entity__` → singular entity name
   - `__entityPlural__` → plural entity name
3. **Update Barrel**: Export through `index.ts`
4. **Write Tests**: Follow template test patterns

## Testing

Template routes can be tested directly:
```bash
pnpm test tests/integration/__entity__.route.test.template.ts
```

## Architecture

Routes follow the layered architecture:
```
Routes → Services → Repositories → Database
```

- Clear separation of concerns
- Type-safe throughout the stack
- Dependency injection via Fastify decorators 