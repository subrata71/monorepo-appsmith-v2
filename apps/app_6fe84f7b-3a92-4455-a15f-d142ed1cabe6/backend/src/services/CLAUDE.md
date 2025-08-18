# Services Layer

Business logic layer using barrel pattern organization.

## Structure

```
services/
├── index.ts                      # Barrel exports
└── __entity__.service.template.ts # Service template
```

## Key Patterns

### Barrel Pattern

- All services exported through `index.ts`
- Clean imports: `import { entityService } from './services'`

### Business Logic Layer

- Separates business logic from data access
- Implements core application functionality
- Type-safe throughout the stack

### Template System

- Template files with `__entity__` and `__entityPlural__` placeholders
- Consistent patterns across entities
- Can be tested directly without copying

## Architecture

Services are part of the layered architecture:

```
Routes → Services → Repositories → Database
```

- Clear separation of concerns
- Business logic separate from data access
- Dependency injection via Fastify decorators

## Adding New Services

1. **Use Template**: Copy `__entity__.service.template.ts`
2. **Replace Placeholders**:
   - `__entity__` → singular entity name
   - `__entityPlural__` → plural entity name
3. **Update Barrel**: Export through `index.ts`
4. **Write Tests**: Follow template test patterns

## Service Responsibilities

- Business logic implementation
- Data validation and transformation
- Orchestrating repository calls
- Error handling and business rules
- Application-specific operations
