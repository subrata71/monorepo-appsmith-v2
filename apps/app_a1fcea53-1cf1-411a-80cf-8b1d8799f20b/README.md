# Minimalist BST Visualizer

A interactive web application for visualizing Binary Search Tree (BST) operations with real-time animations and a clean, minimalist interface.

## Features

- **Interactive BST Operations**: Insert, delete, search, and reset nodes
- **Real-time Animations**: Smooth SVG-based animations for all tree operations  
- **Search Path Highlighting**: Visual path highlighting during search operations
- **Input Validation**: Robust validation for numeric inputs (-999 to 999)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Client-side Logic**: All BST operations handled in the browser for instant feedback

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Zustand** for state management
- **TailwindCSS** for styling
- **SVG** for tree visualization
- **Vite** for build tooling
- **Feature-Sliced Design (FSD)** architecture

### Backend
- **Node.js** with TypeScript
- **Fastify** web framework
- **Drizzle ORM** with PostgreSQL
- **RESTful API** for BST persistence (optional)

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL (for backend API)

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup (Optional)
```bash
cd backend
pnpm install
pnpm run dev
```

The backend API will be available at `http://localhost:3001`

### Full Stack Development
Run both frontend and backend simultaneously:
```bash
# Terminal 1 - Backend
cd backend && pnpm run dev

# Terminal 2 - Frontend  
cd frontend && pnpm run dev
```

## Usage

1. **Insert Node**: Enter a number (-999 to 999) and click "Insert" to add it to the tree
2. **Delete Node**: Enter an existing node value and click "Delete" to remove it
3. **Search Node**: Enter a value and click "Search" to highlight the path to that node
4. **Reset Tree**: Click "Clear All" to empty the entire tree

### Visual Feedback
- **Blue nodes**: Regular tree nodes
- **Green nodes**: Successfully found during search
- **Orange path**: Search traversal path
- **Bouncing animation**: Newly inserted nodes
- **Pulsing effect**: Nodes being operated on

## Architecture

The application follows **Feature-Sliced Design (FSD)** methodology:

```
src/
├── entities/bst/          # BST domain logic & algorithms
├── features/bst-operations/  # User interaction features  
├── widgets/bst-visualization/  # Complex UI components
├── pages/bst-visualizer/     # Route-level components
└── shared/                   # Reusable utilities & UI
```

### Key Components

- **BSTAlgorithms**: Core BST data structure operations
- **useBSTStore**: Zustand store for state management  
- **BSTSVGTree**: SVG-based tree visualization component
- **BSTControlsPanel**: Interactive control interface
- **LayoutCalculator**: Tree positioning & layout logic

## Development

### Code Quality
```bash
# Frontend
cd frontend
pnpm run lint    # Check code style
pnpm run build   # Production build
pnpm run test    # Run tests

# Backend  
cd backend
pnpm run typecheck  # TypeScript checking
pnpm run build     # Production build
pnpm run test      # Run tests
```

### Architecture Decisions

- **Client-side First**: All BST logic runs in the browser for instant feedback
- **Immutable State**: Zustand manages tree state immutably
- **Responsive SVG**: Tree visualization adapts to container size
- **Animation System**: Coordinated animations with proper timing
- **Input Validation**: Type-safe validation with helpful error messages

## API Endpoints (Backend)

The backend provides optional BST persistence:

- `GET /api/v1/bst` - List all saved BST trees
- `POST /api/v1/bst` - Create a new BST tree
- `GET /api/v1/bst/:id` - Get a specific BST tree
- `DELETE /api/v1/bst/:id` - Delete a BST tree
- `POST /api/v1/bst/:id/nodes` - Insert node into a tree

## Contributing

1. Follow the established FSD architecture
2. Use TypeScript for type safety
3. Add tests for new features
4. Ensure responsive design
5. Maintain clean, readable code

## License

MIT License - feel free to use this project for learning and teaching!