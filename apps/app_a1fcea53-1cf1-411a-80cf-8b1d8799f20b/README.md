# Minimalist BST Visualizer

A complete full-stack application for visualizing Binary Search Tree operations with real-time animations.

## Features

✅ **Complete BST Operations**
- Insert nodes with automatic BST placement
- Delete nodes with tree reorganization
- Search nodes with path highlighting
- Reset tree to start fresh

✅ **Real-time Visualization**
- SVG-based tree rendering
- Smooth animations for all operations
- Visual feedback for search paths
- Responsive design for all devices

✅ **Full-Stack Architecture**
- React + TypeScript frontend with modern tooling
- Fastify + Node.js backend with PostgreSQL
- Feature-Sliced Design (FSD) architecture
- Database persistence of BST structures

✅ **Production Ready**
- Complete error handling
- TypeScript throughout
- Comprehensive linting and testing setup
- Database migrations

## Quick Start

### Prerequisites

- Node.js 24.4+
- PostgreSQL running on localhost:5433
- pnpm 10.13+

### Backend Setup

```bash
cd backend
pnpm install
pnpm run dev
```

The backend will:
- Run migrations automatically on startup
- Create BST tables in PostgreSQL
- Start API server on the configured port
- Provide endpoints at `/api/v1/bst/*`

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm run dev
```

The frontend will:
- Start Vite dev server (typically http://localhost:5173)
- Connect to backend API automatically
- Fall back to client-side mode if backend unavailable

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/bst` | Get all BST trees |
| POST | `/api/v1/bst` | Create new BST tree |
| GET | `/api/v1/bst/:id` | Get tree with nodes |
| DELETE | `/api/v1/bst/:id` | Delete BST tree |
| POST | `/api/v1/bst/:id/insert` | Insert node |
| POST | `/api/v1/bst/:id/delete` | Delete node |
| POST | `/api/v1/bst/:id/search` | Search for node |
| POST | `/api/v1/bst/:id/reset` | Clear all nodes |

## Architecture

### Frontend (React + TypeScript)
```
src/
├── app/          # Application shell & routing
├── pages/        # Route components
├── widgets/      # Complex UI assemblies
├── features/     # User interactions
├── entities/     # Domain logic (BST algorithms)
└── shared/       # Infrastructure & UI components
```

### Backend (Fastify + TypeScript)
```
src/
├── app.ts        # Application builder
├── routes/       # API endpoints
├── services/     # Business logic
├── db/           # Database schema & migrations
└── plugins/      # Fastify plugins
```

## Development

### Commands

**Frontend:**
- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm lint` - ESLint checks

**Backend:**
- `pnpm dev` - Development server with hot reload
- `pnpm build` - TypeScript compilation
- `pnpm test` - Run tests
- `pnpm typecheck` - TypeScript validation

### Database

PostgreSQL tables are created automatically via migrations:
- `bst_trees` - Tree metadata
- `bst_nodes` - Individual nodes with relationships

## Technology Stack

**Frontend:**
- React 19.1 + TypeScript
- Vite 7.0 for build tooling
- Tailwind CSS + Shadcn/UI components
- Zustand for state management
- TanStack Query for server state
- Lucide React icons

**Backend:**
- Fastify 5.4 web framework
- Drizzle ORM + PostgreSQL
- TypeScript strict mode
- Vitest for testing
- Pino logging

**Development:**
- ESLint + Prettier
- Husky pre-commit hooks
- Feature-Sliced Design architecture
- pnpm workspaces

## Usage

1. **Start the application** - Run both frontend and backend
2. **Insert nodes** - Enter numbers and click Insert
3. **Visualize structure** - Watch the BST build automatically
4. **Search nodes** - See the traversal path highlighted
5. **Delete nodes** - Observe tree reorganization
6. **Reset anytime** - Clear and start over

The application works in two modes:
- **Connected mode**: Full persistence with backend
- **Offline mode**: Client-side only (fallback)

## Contributing

This application follows strict coding standards:
- TypeScript strict mode
- ESLint with custom rules
- Feature-Sliced Design patterns
- Comprehensive testing

See `CLAUDE.md` files for detailed coding guidelines.