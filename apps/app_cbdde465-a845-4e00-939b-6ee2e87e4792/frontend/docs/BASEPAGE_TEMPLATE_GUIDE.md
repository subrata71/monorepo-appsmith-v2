# BasePage Template Guide

This guide explains how to use `BasePage` as a template for creating new pages in the application. The BasePage demonstrates all the key patterns and best practices required for maintaining consistency across the codebase.

## 📋 Quick Reference Checklist

When creating a new page using BasePage as a template:

- [ ] Use Fragment (`<>`) as root element
- [ ] Import ALL UI components from `@/shared/ui`
- [ ] Structure content in logical sections with comments
- [ ] Use data arrays for repetitive content
- [ ] Implement responsive grid layouts
- [ ] Use `Button asChild` pattern for navigation
- [ ] Include icons from `lucide-react`
- [ ] Ensure all routes exist
- [ ] Follow FSD structure (ui/ folder + index.ts)
- [ ] Provide complete mock data (no placeholders)
- [ ] Run linters and build before completing

## 🏗️ Page Structure Template

```tsx
// [PageName].tsx Template Structure

// 1. Import Organization
import { Link } from 'react-router-dom';
import { /* Import only needed components */ } from '@/shared/ui';
import { /* Import needed icons */ } from 'lucide-react';

export function [PageName]() {
  // 2. Data Definitions
  const contentData = [
    { /* structured data */ }
  ];

  return (
    <>
      {/* Section 1: Hero/Header */}
      <div className="...">
        {/* Hero content */}
      </div>

      {/* Section 2: Metrics/Stats */}
      <div className="grid ...">
        {/* Metric cards */}
      </div>

      {/* Section 3: Main Content */}
      <div className="...">
        {contentData.map((item) => (
          {/* Mapped content */}
        ))}
      </div>

      {/* Section 4: Actions/Footer */}
      <Card>
        {/* Quick actions */}
      </Card>
    </>
  );
}
```

## 🎨 Key Patterns Explained

### 1. Data-Driven Content Pattern

Instead of hardcoding repetitive content, use data arrays:

```tsx
// ✅ Good: Data-driven approach
const features = [
  {
    icon: Users,
    title: 'Feature Name',
    description: 'Feature description...',
    link: '/route',
    linkText: 'Action Text',
  },
  // More features...
];

// Map the data to components
{
  features.map(feature => (
    <Card key={feature.title}>{/* Card content */}</Card>
  ));
}
```

### 2. Navigation Pattern

Always use the `asChild` pattern for navigation buttons:

```tsx
// ✅ Correct: Button with asChild + Link
<Button asChild size="lg">
  <Link to="/customers">
    <Users className="mr-2 h-5 w-5" />
    View Customers
  </Link>
</Button>

// ❌ Wrong: onClick handler or custom navigation
<Button onClick={() => navigate('/customers')}>
  View Customers
</Button>
```

### 3. Responsive Grid Patterns

Use mobile-first responsive grids:

```tsx
// Stats Grid: 1 → 4 columns
<div className="grid gap-4 md:grid-cols-4">

// Feature Grid: 1 → 2 → 3 columns
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

// Action Grid: 1 → 2 → 4 columns
<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
```

### 4. Icon Usage Patterns

Consistent icon sizing based on context:

```tsx
// Large buttons/heroes
<Icon className="h-5 w-5" />

// Feature cards
<Icon className="h-6 w-6" />

// Compact buttons
<Icon className="h-4 w-4" />

// Always with margin when preceding text
<Icon className="mr-2 h-5 w-5" />
```

### 5. Typography Hierarchy

Follow consistent text sizing:

```tsx
// Page Title
<h1 className="text-4xl font-bold tracking-tight">

// Section Title
<h2 className="text-2xl font-bold">

// Card Title
<CardTitle className="text-lg">

// Metric Value
<div className="text-2xl font-bold">

// Supporting Text
<p className="text-muted-foreground">
```

## 📦 Component Guidelines

### Never Create Custom Components

All UI components must come from `@/shared/ui`:

```tsx
// ✅ Correct
import { Button, Card, Input } from '@/shared/ui';

// ❌ Wrong
const CustomButton = () => { ... };
const MyCard = styled.div`...`;
```

### Never Add className to Shared Components

The shared UI components don't accept className props:

```tsx
// ✅ Correct: Wrap in div if styling needed
<div className="space-y-4">
  <Button>Click me</Button>
</div>

// ❌ Wrong: Adding className to shared component
<Button className="mt-4">Click me</Button>
```

## 🚀 Creating a New Page Step-by-Step

### 1. Create the Page Structure

```bash
src/pages/
  [page-name]/
    ui/
      [PageName].tsx
    index.ts
```

### 2. Start with BasePage Template

Copy the structure from BasePage and modify:

```tsx
// src/pages/[page-name]/ui/[PageName].tsx
import { Link } from 'react-router-dom';
import { Card, Button } from '@/shared/ui';
import { /* icons */ } from 'lucide-react';

export function [PageName]() {
  // Define your data
  const items = [...];

  return (
    <>
      {/* Modify sections as needed */}
    </>
  );
}
```

### 3. Export via index.ts

```tsx
// src/pages/[page-name]/index.ts
export { [PageName] } from './ui/[PageName]';
```

### 4. Add Route

Update `AppRoutes.tsx` to include your new page.

### 5. Validate

Run these commands before considering the page complete:

```bash
pnpm lint
tsc --noEmit
pnpm build
```

## 🔍 Common Patterns by Page Type

### Dashboard/Overview Pages

Use BasePage structure with:

- Hero section with CTAs
- Metric cards grid
- Feature showcase
- Quick actions

### List/Table Pages

Adapt the structure to:

- Header with search/filters
- Data table/grid
- Pagination
- Bulk actions

### Form Pages

Modify to include:

- Form header/description
- Form sections in Cards
- Action buttons
- Validation messages

### Detail/Profile Pages

Structure with:

- Entity header
- Tab navigation
- Content sections
- Related actions

## ⚠️ Important Rules

1. **No Stubs**: Always provide complete functionality
2. **No Dead Links**: All routes must exist
3. **No Placeholders**: Use realistic mock data
4. **No TODO Comments**: Complete implementation only
5. **No Custom Errors**: Use standard error patterns
6. **No Backend Calls**: Use mock service worker

## 📝 Example: Creating a Products Page

```tsx
// src/pages/products/ui/ProductsPage.tsx
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';
import { Package, Plus, Search, Filter } from 'lucide-react';

export function ProductsPage() {
  const categories = [
    {
      icon: Package,
      name: 'Electronics',
      count: 1234,
      link: '/products?category=electronics',
    },
    // More categories...
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Products</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/products/new">
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <Card key={category.name}>
              <CardHeader>
                <Icon className="h-6 w-6" />
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{category.count} products</p>
                <Button asChild variant="outline" size="sm">
                  <Link to={category.link}>View</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
```

## 📝 Example: Using with Router

```tsx
<Route element={<AppLayout />}>
  <Route path="/" element={<BasePage />} />
</Route>
```

This example shows how to adapt the BasePage patterns for a products listing page while maintaining all the required patterns and standards.
