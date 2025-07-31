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

- `pnpm test` - Run all tests with automatic setup
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run coverage` - Generate coverage report

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
│   └── schema.ts       # Drizzle ORM schema
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
- All routes auto-prefixed with `/api/v1`

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

## Environment Configuration

### Critical Environment Variables

- `APP_DATABASE_URL` - Database connection string (pre-configured in .env file)
- `PORT` - Server port (pre-configured in .env file)
- `NODE_ENV` - Environment mode

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
3. **Start Application**: Migrations run automatically on app startup
4. **Use Templates**: Copy and customize template files
5. **Update Barrels**: Export through respective `index.ts` files
6. **Write Tests**: Follow template test patterns

### Template File System

Template files use placeholder replacement:

- `__entity__` → singular entity name
- `__entityPlural__` → plural entity name
- Templates are fully functional and testable

### Database Migration Pattern

1. Always create SQL migrations in `src/db/migrations/` first
2. Never modify existing migrations
3. Use database inspection tools for database management
4. Always refer to the README.md file at `src/db/README.md` for instructions on how to write good migrations.

## Code Quality Standards

### TypeScript Configuration

- Strict mode enabled
- ESM modules with `.js` extensions
- Custom Fastify instance types in `src/types/fastify.d.ts`

### Testing Requirements

- All new features must have tests
- Database reset helpers provided
- Template tests serve as examples

### Performance Monitoring

- Pino logging with pretty development output
- Request timing hooks for performance monitoring
- Connection pooling via pg.Pool

## Common Issues and Solutions

### Environment & Database Issues

- Ensure PostgreSQL is running and accessible
- Use database inspection tools to verify database connectivity

### Template Usage

- Template files are fully functional and can be tested directly
- Replace placeholders consistently throughout the codebase
- Update barrel exports after adding new entities

## Integration Notes

### Frontend Integration

- SPA fallback configured for frontend routes
- Static file serving when frontend is built
- API base URL: `/api/v1`
