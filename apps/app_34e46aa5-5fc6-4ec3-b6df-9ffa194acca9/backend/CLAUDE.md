# Backend Template

Fastify-based TypeScript backend with PostgreSQL, Drizzle ORM, and automatic
migrations/seeds.

## Project Structure

```
src/
├── config/           # Environment configuration
├── constants/        # Application constants
├── db/              # Database schema, migrations, connection
├── hooks/           # Fastify hooks (request timing, etc.)
├── plugins/         # Fastify plugins
├── repositories/    # Data access layer
├── routes/          # API endpoints
├── seeds/           # Database seed files
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Patterns

### Entity Development Workflow

1. **OpenAPI First**: Define API contract in
   `../shared/open-api-specs/__entity__.ts`
2. **Generate Types**: Run `pnpm generate-types` in shared folder
3. **Schema**: Define tables in `src/db/schema.ts`
4. **Create Migration**: Add SQL file to `src/db/migrations/`
5. **Add Seeds**: Create SQL file in `src/seeds/sql_files/` (optional)
6. **Use Templates**: Copy and customize template files
7. **Update Barrels**: Export through respective `index.ts` files

### Template System

- Template files use placeholder replacement: `__entity__` → singular,
  `__entityPlural__` → plural
- Templates are fully functional and testable
- Copy templates, don't modify originals

### Database

- **Migrations**: SQL files in `src/db/migrations/` (never modify existing)
- **Seeds**: SQL files in `src/seeds/sql_files/` (run automatically)
- **Schema**: Defined in `src/db/schema.ts` using Drizzle ORM

### Code Organization

- **Barrel Pattern**: Use `index.ts` files for clean imports
- **Type Safety**: Use generated types from shared folder
- **Environment**: Add variables to `src/config/env.schema.ts`

## Essential Commands

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Generate types from OpenAPI
cd ../shared && pnpm generate-types
```

## Standards

- **TypeScript**: Strict mode, ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful endpoints with OpenAPI specs
- **Testing**: Vitest with separate test database
- **Logging**: Pino with structured logging

## Important Notes

- Migrations and seeds run automatically on app startup
- Never modify existing migrations
- Always use generated types from shared folder
- Template files are in each directory with `__entity__` placeholders
