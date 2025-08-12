# Routes Layer

API route handlers using Fastify with barrel pattern organization.

## Structure

```
routes/
├── index.ts                    # Barrel exports
├── health.route.ts             # Health check endpoint
└── __entity__.route.template.ts # Route template
```

## Key Patterns

### Barrel Pattern
- All routes exported through `index.ts`
- Clean imports: `import { healthRoutes } from './routes'`

### Template System
- Template files with `__entity__` and `__entityPlural__` placeholders
- Consistent patterns across entities
- Can be tested directly without copying

## Available Endpoints

### Health Check
- `GET /health` - Health check endpoint (includes migration status)

### Template Endpoints
- `GET /__entityPlural__` - List entities
- `POST /__entityPlural__` - Create entity
- `GET /__entityPlural__/:id` - Get entity by ID
- `PUT /__entityPlural__/:id` - Update entity
- `DELETE /__entityPlural__/:id` - Delete entity

## Adding New Routes

1. **Use Template**: Copy `__entity__.route.template.ts`
2. **Replace Placeholders**:
   - `__entity__` → singular entity name
   - `__entityPlural__` → plural entity name
3. **Update Barrel**: Export through `index.ts`
4. **Write Tests**: Follow template test patterns

## Architecture

Routes follow the layered architecture:
```
Routes → Services → Repositories → Database
```

- Clear separation of concerns
- Type-safe throughout the stack
- Dependency injection via Fastify decorators
