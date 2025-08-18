# Application Template Overview

This is a full-stack application template designed for rapid development with modern best practices.

## Architecture Overview

This template follows an **OpenAPI-first architecture** where:

- **Shared API Contract**: OpenAPI 3.1 specifications serve as the single source of truth
- **Type Generation**: TypeScript types are automatically generated from OpenAPI specs
- **Type Safety**: Both frontend and backend use generated types for compile-time safety
- **Consistency**: Perfect consistency between API documentation and implementation

## Component-Specific Guidelines

This template consists of three main components, each with their own detailed documentation:

### Shared API Contract

**Location**: `shared/` directory  
**Documentation**: `@shared/CLAUDE.md`  
**Focus**: OpenAPI specifications, type generation, and API contract management

### Frontend

**Location**: `frontend/` directory  
**Documentation**: `@frontend/CLAUDE.md`  
**Focus**: Client-side coding guidelines, component architecture, UI patterns, and development workflow

### Backend

**Location**: `backend/` directory  
**Documentation**: `@backend/CLAUDE.md`  
**Focus**: Server-side patterns, API development, database operations, and testing strategies

## Development Approach

1. **API Contract First**: Reference `@shared/CLAUDE.md` for OpenAPI specifications and type generation
2. **Frontend Development**: Reference `@frontend/CLAUDE.md` for complete React + TypeScript development guidelines
3. **Backend Development**: Reference `@backend/CLAUDE.md` for complete Fastify + TypeScript backend patterns
4. **Full-Stack Features**: Coordinate between components following the established patterns in each respective documentation

## Quick Start

Refer to the component-specific CLAUDE.md files for detailed setup and development commands.
