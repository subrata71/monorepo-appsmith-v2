# Routing Guidelines

## Core Architecture

### Layout-Based Routing

- Use **nested routes** with layout components for consistent structure
- AppRoutes should wrap routes in the appropriate layout (AppLayout, SidebarLayout, etc.)
- All routes must be contained within a layout component

### Required Route Patterns

1. **Root Route Handler**: Always include a route handler for "/"
2. **Layout Wrapper**: Wrap all routes in a layout component
3. **Catch-All Route**: Include catch-all route (\*) for undefined paths
4. **Redirect Strategy**: Use `Navigate` component for redirects

## Route Structure Examples

### Basic Route Setup

```tsx
import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect root to primary page */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Application routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />

        {/* Catch undefined routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
```

### Entity-Based Routes (CRUD patterns)

```tsx
{/* Entity listing */}
<Route path="/products" element={<ProductsListPage />} />

{/* Entity creation */}
<Route path="/products/new" element={<CreateProductPage />} />

{/* Entity details/editing */}
<Route path="/products/:id" element={<ProductDetailPage />} />
<Route path="/products/:id/edit" element={<EditProductPage />} />
```

### Nested Routes

```tsx
{
  /* Nested dashboard sections */
}
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardOverview />} />
  <Route path="analytics" element={<Analytics />} />
  <Route path="reports" element={<Reports />} />
</Route>;
```

## Route Generation Patterns

### Page Component Naming

- **List pages**: `<Entity>ListPage` or `<Entity>sPage`
- **Detail pages**: `<Entity>DetailPage`
- **Create pages**: `Create<Entity>Page`
- **Edit pages**: `Edit<Entity>Page`

### Route Path Conventions

- **Collections**: `/entities` (plural)
- **New item**: `/entities/new`
- **Item details**: `/entities/:id`
- **Item editing**: `/entities/:id/edit`
- **Nested resources**: `/entities/:id/sub-entities`

## Import Requirements

```tsx
// Required React Router imports
import { Routes, Route, Navigate } from 'react-router';

// Layout components
import { AppLayout } from '@/app/layouts';
// or
import { SidebarLayout } from '@/app/layouts';

// Page components (create these in src/pages/)
import { HomePage } from '@/pages/home';
import { DashboardPage } from '@/pages/dashboard';
```

## Navigation Integration

### Link Components

```tsx
import { Link } from 'react-router';

// Always use Link for internal navigation
<Link to="/dashboard">Dashboard</Link>

// External links use regular anchor tags
<a href="https://external.com" target="_blank">External</a>
```

### Programmatic Navigation

```tsx
import { useNavigate } from 'react-router';

const navigate = useNavigate();

// Navigate to route
navigate('/dashboard');

// Replace current route
navigate('/dashboard', { replace: true });
```

## Error Handling

### Route Guards

```tsx
// Conditional routes
<Route
  path="/admin"
  element={
    <ConditionalRoute condition={hasAdminAccess}>
      <AdminPanel />
    </ConditionalRoute>
  }
/>
```

### Loading States

```tsx
// Lazy-loaded routes with Suspense
import { Suspense } from 'react';

const LazyPage = lazy(() => import('@/pages/heavy-page'));

<Route
  path="/heavy"
  element={
    <Suspense fallback={<PageSkeleton />}>
      <LazyPage />
    </Suspense>
  }
/>;
```

## UI Requirements

- **Never** create links that point to non-existing routes
- **Always** test that all navigation works correctly
- **Ensure** all redirects function as expected
- **Validate** that catch-all routes redirect appropriately
- **Check** that layout components render correctly for all routes

## Development Checklist

- [ ] All routes wrapped in appropriate layout component
- [ ] Root route ("/") handler exists
- [ ] Catch-all route ("\*") redirects properly
- [ ] All navigation links point to existing routes
- [ ] Route parameters are properly typed
- [ ] Loading states implemented for heavy pages
- [ ] Conditional routes have proper checks
- [ ] Mobile navigation works correctly
