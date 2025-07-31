# App Template Backend

This is a TypeScript/Node.js backend template for building web applications with Fastify, Drizzle ORM, and PostgreSQL. This template provides a solid foundation for creating scalable backend services with a clean architecture and comprehensive testing setup.

> **Note**: This is the backend-specific documentation. For overall project setup and frontend information, see the [main README](../README.md).

## 🏗️ Project Structure

```
backend/
├── src/                          # Source code directory
│   ├── app.ts                    # Main application builder
│   ├── server.ts                 # Server entry point
│   ├── config/                   # Configuration files
│   ├── db/                       # Database layer - [📖 Details](src/db/README.md)
│   ├── plugins/                  # Fastify plugins
│   ├── repositories/             # Data access layer - [📖 Details](src/repositories/README.md)
│   ├── services/                 # Business logic layer - [📖 Details](src/services/README.md)
│   ├── routes/                   # API route handlers - [📖 Details](src/routes/README.md)
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   └── hooks/                    # Fastify hooks
├── tests/                        # Test files - [📖 Details](tests/README.md)
├── scripts/                      # Utility scripts
├── drizzle.config.ts             # Drizzle ORM configuration
├── package.json                  # Node.js dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Vitest test configuration
└── .gitignore                    # Git ignore patterns
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v24.4 or higher)
- pnpm (v10.13.0 or higher)
- PostgreSQL database

### Local Development Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Variables**
   The application comes with a pre-configured `.env` file with all necessary environment variables.

3. **Start Development Server**
   ```bash
   pnpm dev
   ```
   
   The server will start on the configured port

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm start` | Start production server |
| `pnpm run dev` | Start development server with hot reload |
| `pnpm test` | Run all tests (includes test setup) |
| `pnpm run test:watch` | Run tests in watch mode |
| `pnpm run test:setup` | Setup test database and migrations |

| `pnpm run typecheck` | Run TypeScript type checking |
| `pnpm run coverage` | Generate test coverage report |
| `pnpm run build` | Build TypeScript to JavaScript |

## 🗄️ Database Configuration

Database connection details are pre-configured in the `.env` file.

### Database Technologies
- **Drizzle ORM**: Type-safe SQL ORM for application code
- **SQL Migrations**: For schema changes and complex operations
- **PostgreSQL**: Primary database with advanced features

For detailed database information, see [Database Layer Documentation](src/db/README.md).

## 🔧 Architecture Patterns

### 1. Fastify Plugin System
- Environment configuration via `@fastify/env`
- Database connection as a plugin
- Type-safe configuration with schema validation
- All routes auto-prefixed with `/api/v1`

### 2. Layered Architecture
Routes → Services → Repositories → Database
- Clear separation of concerns
- Type-safe throughout the stack
- Dependency injection via Fastify decorators

### 3. Barrel Pattern Organization
- Repositories, services, and routes use `index.ts` for clean imports
- Template files for consistent scaffolding
- Public API pattern: `export { ComponentName } from './ComponentName'`

### 4. Template-Driven Development
- Template files with `__entity__` and `__entityPlural__` placeholders
- Consistent patterns across entities
- Working tests for templates

## 📝 Development Guidelines

### Adding New Features

1. **Database Schema**: Define tables in `src/db/schema.ts` (see [Database Layer](src/db/README.md))
2. **Repository Layer**: Create repository files in `src/repositories/` (see [Repositories Layer](src/repositories/README.md))
3. **Service Layer**: Create service files in `src/services/` (see [Services Layer](src/services/README.md))
4. **API Routes**: Create route files in `src/routes/` (see [Routes Layer](src/routes/README.md))
5. **Environment Variables**: Add new variables to `src/config/env.schema.ts`

### Adding New Entities

1. **Schema First**: Define tables in `src/db/schema.ts`
2. **Create SQL Migration**: Add file to `src/db/migrations/`
3. **Start Application**: Migrations run automatically on app startup
4. **Use Templates**: Copy and customize template files
5. **Update Barrels**: Export through respective `index.ts` files
6. **Write Tests**: Follow template test patterns

## 🧪 Testing Setup

For comprehensive testing information, see [Testing Documentation](tests/README.md).

### Quick Test Setup

1. **Copy Test Environment File**
   ```bash
   cp .env.test.example .env.test
   ```

2. **Update Test Database Configuration**
   Edit `.env.test` and configure your test database connection details.

3. **Run Tests**
   ```bash
   pnpm test
   ```

## 🔒 Environment Variables

### Production/Development Environment

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_DATABASE_URL` | PostgreSQL connection string | Yes |
| `PORT` | Server port | No |
| `NODE_ENV` | Environment mode | No |

### Test Environment

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_DATABASE_URL` | Test PostgreSQL connection string | Yes |
| `NODE_ENV` | Set to "test" for test environment | Yes |

## 🌐 API Structure

### Base URL
All API endpoints are prefixed with `/api/v1`

### Available Endpoints
- `GET /api/v1/health` - Health check endpoint (includes migration status)
- Template endpoints available for entities

For detailed API information, see [Routes Layer Documentation](src/routes/README.md).

## 📚 Key Dependencies

### Core Dependencies
- **Fastify**: High-performance web framework
- **Drizzle ORM**: Type-safe SQL ORM
- **PostgreSQL**: Primary database
- **TypeScript**: Type-safe JavaScript

### Development Dependencies
- **tsx**: TypeScript execution engine (fast and ESM-native)
- **drizzle-kit**: Database migration and management tools
- **@fastify/env**: Environment variable management
- **vitest**: Fast unit testing framework

## 🤝 Contributing

When working with this template:

1. Follow the existing code organization patterns
2. Use the barrel pattern for clean imports (repositories, services, routes)
3. Maintain type safety throughout
4. Add environment variables to the schema
5. Create SQL migrations for database changes
6. Use Fastify plugins for modular functionality
7. Write tests for new features
8. Use template files for scaffolding new entities
9. Follow the `/api/v1` prefix convention for all routes
10. Migrations run automatically on app startup
11. Never modify existing migrations
12. Use database inspection tools for database management

## 📖 Additional Resources

- [Fastify Documentation](https://www.fastify.io/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🔄 Integration Notes

### Frontend Integration
- SPA fallback configured for frontend routes
- Static file serving when frontend is built
- API base URL: `/api/v1`


