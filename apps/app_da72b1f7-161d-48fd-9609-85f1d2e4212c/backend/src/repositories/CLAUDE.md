# Repositories Layer

This directory contains the data access layer using barrel pattern organization.

## Structure

```
repositories/
├── index.ts                    # Barrel exports for repositories
└── __entity__.repo.template.ts # Repository template
```

## Key Patterns

### Barrel Pattern

- All repositories exported through `index.ts`
- Clean imports: `import { entityRepo } from './repositories'`
- Public API pattern: `export { ComponentName } from './ComponentName'`

### Data Access Layer

- Type-safe database operations using Drizzle ORM
- Abstracts database queries from business logic
- Provides clean data access interface

### Template System

- Template files with `__entity__` and `__entityPlural__` placeholders
- Consistent patterns across entities
- Can be tested directly without copying

## Architecture

Repositories are part of the layered architecture:

```
Routes → Services → Repositories → Database
```

- Clear separation of concerns
- Type-safe throughout the stack
- Dependency injection via Fastify decorators

## Adding New Repositories

1. **Use Template**: Copy `__entity__.repo.template.ts`
2. **Replace Placeholders**:
   - `__entity__` → singular entity name
   - `__entityPlural__` → plural entity name
3. **Update Barrel**: Export through `index.ts`
4. **Write Tests**: Follow template test patterns

## Repository Responsibilities

- Database CRUD operations
- Query building and optimization
- Data mapping and transformation
- Database connection management
- Type-safe database interactions

## Drizzle ORM Integration

Repositories use Drizzle ORM for:

- Type-safe SQL queries
- Schema-based operations
- Connection pooling
- Transaction management

## Testing

Template repositories can be tested directly:

```bash
pnpm test tests/unit/__entity__.repo.test.template.ts
```
