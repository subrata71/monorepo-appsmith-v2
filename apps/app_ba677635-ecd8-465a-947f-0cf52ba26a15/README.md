# 2048 Game

A full-stack web implementation of the classic 2048 sliding tile puzzle game, built with TypeScript backend (Fastify + Drizzle ORM + PostgreSQL) and React frontend.

## 🎮 Features

- **Interactive 2048 Game**: Complete implementation with smooth animations
- **Keyboard Controls**: Use arrow keys to move tiles
- **Touch Support**: Swipe gestures for mobile devices
- **Score Tracking**: Real-time score updates and best score persistence
- **Game States**: Win/loss detection with overlay notifications
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Project Structure

```
app-template/
├── backend/                      # TypeScript/Node.js backend
│   ├── src/                      # Source code
│   │   ├── db/                   # Database layer - [📖 Details](backend/src/db/README.md)
│   │   ├── repositories/         # Data access layer - [📖 Details](backend/src/repositories/README.md)
│   │   ├── services/             # Business logic layer - [📖 Details](backend/src/services/README.md)
│   │   ├── routes/               # API route handlers - [📖 Details](backend/src/routes/README.md)
│   │   └── ...                   # Other source files
│   ├── tests/                    # Test files - [📖 Details](backend/tests/README.md)
│   ├── scripts/                  # Development scripts
│   ├── drizzle.config.ts         # Drizzle ORM configuration
│   ├── package.json              # Backend dependencies
│   └── README.md                 # Backend-specific documentation
├── frontend/                     # React frontend
│   ├── src/                      # Source code
│   ├── public/                   # Static assets
│   └── package.json              # Frontend dependencies

└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v24.4 or higher)
- pnpm (v10.13.0 or higher)
- PostgreSQL database

## 🔧 Development

### Backend Development

For detailed backend development information, see [backend/README.md](backend/README.md).

The backend is a TypeScript/Node.js application using:
- **Fastify**: High-performance web framework
- **Drizzle ORM**: Type-safe SQL ORM
- **PostgreSQL**: Primary database
- **Vitest**: Testing framework

#### Quick Backend Setup

```bash
cd backend
pnpm install
pnpm run dev
```

### Frontend Development

The frontend is a React application with:
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **React**: UI framework

#### Quick Frontend Setup

```bash
cd frontend
pnpm install
pnpm run dev
```

## 📚 API Documentation

### Base URL
- **Local**: http://localhost:3001 (configurable via PORT environment variable)

### Health Check

Test if the application is running:
```bash
curl http://localhost:3001/api/v1/health
```

Expected response:
```json
{
  "app": "ok",
  "db": "ok",
  "migrations": "ok",
  "at": 1234567890
}
```

### 2048 Game API Endpoints

#### Initialize New Game
```bash
curl -X POST http://localhost:3001/api/v1/games/init
```

#### Make a Move
```bash
curl -X POST http://localhost:3001/api/v1/games/{id}/move \
  -H "Content-Type: application/json" \
  -d '{"direction": "up"}'
```

#### Reset Game
```bash
curl -X POST http://localhost:3001/api/v1/games/{id}/reset
```

#### Get Game State
```bash
curl http://localhost:3001/api/v1/games/{id}
```

#### Get Leaderboard
```bash
curl http://localhost:3001/api/v1/games/leaderboard?limit=10
```

For detailed API documentation, see [backend/README.md](backend/README.md).

## 🔒 Environment Variables

### Backend Environment

The application comes with a pre-configured `.env` file in the `backend/` directory with all necessary environment variables.



## 🔄 Development Workflow

### Adding New Features

1. **Backend**: See [backend/README.md](backend/README.md) for detailed backend development guidelines
2. **Frontend**: Add components in `frontend/src/components/` and pages in `frontend/src/pages/`
3. **Database**: Use SQL migrations (see [Database Layer Documentation](backend/src/db/README.md))

### Code Organization

- **Backend**: Follows clean architecture with repositories, services, and routes
- **Frontend**: Component-based architecture with React

## 📖 Documentation Structure

The backend documentation is organized into focused modules:

- **[Backend Overview](backend/README.md)** - Quick start and architecture overview
- **[Database Layer](backend/src/db/README.md)** - Schema, migrations, and database patterns
- **[Routes Layer](backend/src/routes/README.md)** - API endpoints and route organization
- **[Services Layer](backend/src/services/README.md)** - Business logic layer
- **[Repositories Layer](backend/src/repositories/README.md)** - Data access layer
- **[Testing](backend/tests/README.md)** - Test structure and configuration

## 🚀 Deployment

### Environment Variables for Production

Update the environment variables in the environment files for production deployment.

## 🤝 Contributing

1. Follow the existing code organization patterns
2. Use TypeScript for type safety
3. Write tests for new features
4. Follow the API versioning convention (`/api/v1/`)
5. Use the barrel pattern for clean imports (backend)
6. Create SQL migrations for database changes

## 📖 Additional Documentation

- **Backend**: See [backend/README.md](backend/README.md) for detailed backend documentation
- **API**: Use the health endpoint to verify the application is running

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**
   - Backend uses configurable port (default: 3001)
   - Update PORT environment variable if needed

2. **Database connection issues**
   - Ensure PostgreSQL is running and accessible

3. **Migration errors**
   - See [Database Layer Documentation](backend/src/db/README.md) for migration troubleshooting

### Getting Help

- Test database connection
- Check the health endpoint: `curl http://localhost:3001/api/v1/health`
- Refer to [backend/README.md](backend/README.md) for backend-specific issues 