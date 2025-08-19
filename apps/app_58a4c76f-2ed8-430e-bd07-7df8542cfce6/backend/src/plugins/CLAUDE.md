# Plugins Layer

Infrastructure layer using barrel pattern organization.

## Structure

```
plugins/
├── index.ts                           # Barrel exports
├── db.ts                             # Database plugin
└── __plugin__.plugin.template.ts      # Plugin template
```

## Key Patterns

### Barrel Pattern

- All plugins exported through `index.ts`
- Clean imports: `import { pluginName } from './plugins'`

### Infrastructure Layer

- Sets up core application infrastructure
- Provides shared services and decorators
- Manages application lifecycle and resources

### Template System

- Template files with `__plugin__` and `__Plugin__` placeholders
- Consistent patterns across plugins
- Copy templates before modifying (don't modify originals)

## Architecture

Plugins provide infrastructure for all layers:

```
Routes → Services → Repositories → Database
  ↑         ↑          ↑           ↑
  └─────── Plugins ────────────────┘
```

- Plugins provide infrastructure for all layers
- Decorates FastifyInstance with shared services
- Manages resource lifecycle and cleanup

## Adding New Plugins

1. **Use Template**: Copy `__plugin__.plugin.template.ts`
2. **Replace Placeholders**:
   - `__plugin__` → plugin name
   - `__Plugin__` → capitalized plugin name
3. **Update Barrel**: Export through `index.ts`
4. **Write Tests**: Follow template test patterns

## Plugin Responsibilities

- Infrastructure setup and configuration
- Resource management and cleanup
- FastifyInstance decoration
- Lifecycle hook management
- Cross-cutting concerns (logging, monitoring, etc.)

## Factory Pattern

Plugins use factory functions for:

- Dependency injection
- Immediate initialization
- Type-safe decorators
- Automatic resource cleanup
