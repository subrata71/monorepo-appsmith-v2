# Project Context

This is a full-stack application template with React + TypeScript frontend and Fastify + TypeScript backend components.

## Child Directory Context

Reference the following component-specific guidelines:

### Frontend (React + Vite + TypeScript)
@frontend/CLAUDE.md - Client-side coding guidelines, component architecture, and UI patterns

### Backend (Fastify + Node.js + TypeScript)
- Located in `backend/` directory
- @backend/CLAUDE.md - Backend coding guidelines
- Database integration with Drizzle ORM
- The environment file will always have the required URL for database. Never try to override it

## Development Guidelines

1. **Frontend Development**: Reference `@frontend/CLAUDE.md` for React + TypeScript component patterns, layout requirements, and architectural decisions
2. **Backend Development**: Reference `@backend/CLAUDE.md` for Fastify + Node.js/TypeScript backend patterns
3. **Full-Stack Features**: Coordinate between frontend and backend following the established patterns in each respective CLAUDE.md file

## Getting Started

- Frontend: `cd frontend && pnpm install && pnpm run dev`
- Backend: `cd backend && pnpm install && pnpm run dev`
