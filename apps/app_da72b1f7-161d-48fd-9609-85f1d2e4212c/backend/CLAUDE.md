# CLAUDE.md

This file provides guidance to generate backend code for the application.

## Core Commands

### Development

- `pnpm dev` - Start development server with hot reload
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm build` - Build TypeScript to JavaScript

### Database Operations

- `pnpm run test:setup` - Setup test database and migrations

### Testing

- `pnpm test` - Run all tests with automatic setup (includes test setup)
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run coverage` - Generate test coverage report

## Architecture Overview

### Tech Stack

- **Node.js 24.4+** with **TypeScript** (strict mode)
- **Fastify** web framework with plugin architecture
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** database
- **Vitest** for comprehensive testing

### Directory Structure

```
src/
├── app.ts              # Main application builder
├── server.ts           # Server entry point
├── config/             # Environment schema & configuration
├── db/                 # Database schema definitions
│   ├── migrations/     # SQL migrations
│   ├── migrations.ts   # Migration runner
│   ├── connection.ts   # Database connection singleton
│   └── schema.ts       # Drizzle ORM schema
├── seeds/              # Database seeding
│   ├── sql_files/      # SQL seed files
│   ├── index.ts        # Seed orchestrator
│   └── seed-runner.ts  # Seed execution engine
├── plugins/            # Fastify plugins (DB connection, etc.)
├── repositories/       # Data access layer (barrel pattern)
├── services/           # Business logic layer (barrel pattern)
├── routes/             # API route handlers (barrel pattern)
├── hooks/              # Request/response hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Patterns

#### 1. Fastify Plugin System

- Environment configuration via `@fastify/env` with schema validation
- Database connection as decorated plugin
- All routes auto-prefixed with constants.API_PREFIX

#### 2. Barrel Pattern Organization

- Repositories, services, and routes use `index.ts` for clean imports
- Template files for consistent scaffolding
- Public API pattern: `export { ComponentName } from './ComponentName'`

#### 3. Layered Architecture

Routes → Services → Repositories → Database

- Clear separation of concerns
- Type-safe throughout the stack
- Dependency injection via Fastify decorators

#### 4. Template-Driven Development

- Template files with `__entity__` and `__entityPlural__` placeholders
- Consistent patterns across entities
- Working tests for templates

**⚠️ TEMPLATE FILE PRESERVATION ⚠️**
Template files should NEVER be modified or deleted. They serve as reference and should only be copied for new implementations.

## Environment Configuration

### Prerequisites

- Node.js (v24.4 or higher)
- pnpm (v10.13.0 or higher)
- PostgreSQL database

### Critical Environment Variables

- `APP_DATABASE_URL` - Database connection string (pre-configured in .env file)
- `PORT` - Server port (pre-configured in .env file)
- `NODE_ENV` - Environment mode

The application comes with a pre-configured `.env` file with all necessary environment variables.

## Testing Infrastructure

### Test Configuration

- Uses separate `.env.test` file
- Automatic database setup/teardown
- Template tests work out of the box

### Test Layers

- **Integration**: `tests/integration/` - API endpoint tests
- **E2E**: `tests/e2e/` - End-to-end application tests
- **Helpers**: `tests/helpers/` - Database reset utilities

## Development Workflow

### Adding New Entities

1. **Schema First**: Define tables in `src/db/schema.ts`
2. **Create SQL Migration**: Add file to `src/db/migrations/`
3. **Add Seed Data**: Create SQL seed file in `src/seeds/sql_files/` (optional)
4. **Start Application**: Migrations and seeds run automatically on app startup
5. **Use Templates**: Copy and customize template files
6. **Update Barrels**: Export through respective `index.ts` files
7. **Write Tests**: Follow template test patterns

### Template File System

Template files use placeholder replacement:

- `__entity__` → singular entity name
- `__entityPlural__` → plural entity name
- Templates are fully functional and testable

### Database Migration Pattern

1. Always create SQL migrations in `src/db/migrations/` first
2. Never modify existing migrations
3. Use database inspection tools for database management
4. Always refer to the CLAUDE.md file at `src/db/CLAUDE.md` for instructions on how to write good migrations.

### Database Seeding Pattern

1. Create SQL seed files in `src/seeds/sql_files/` with numbered naming convention
2. Seeds run automatically after migrations during app startup
3. Seeds are environment-aware (disabled in production by default)
4. Seeds are tracked in `seed_log` table to prevent re-running
5. Always refer to the CLAUDE.md file at `src/seeds/CLAUDE.md` for detailed seeding instructions.

## Standards

**TypeScript**: Strict mode, ESM modules, custom Fastify types
**Performance**: Pino logging, request timing hooks, connection pooling

## Contributing Guidelines

When working with this template:

1. Follow the existing code organization patterns
2. Use the barrel pattern for clean imports (repositories, services, routes)
3. Maintain type safety throughout
4. Add environment variables to the schema
5. Create SQL migrations for database changes
6. Use Fastify plugins for modular functionality
7. Write tests for new features
8. Use template files for scaffolding new entities (copy, don't modify)
9. Routes always use constants.API_PREFIX
10. Migrations and seeds run automatically on app startup
11. Never modify existing migrations
12. Use database inspection tools for database management
13. Seeds are environment-aware (disabled in production by default)

## Additional Resources

- [Fastify Documentation](https://www.fastify.io/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Integration Notes

### Frontend Integration

- SPA fallback configured for frontend routes
- Static file serving when frontend is built
- API base URL: always use constants.API_PREFIX

## Notes

**Database**: Ensure PostgreSQL is running and accessible
**Templates**: Replace `__entity__` placeholders, update barrel exports
**Frontend**: SPA fallback configured, API base URL always use constants.API_PREFIX
