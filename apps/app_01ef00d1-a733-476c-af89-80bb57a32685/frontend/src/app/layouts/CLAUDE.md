# Layout Guidelines

## Template System Overview

This application uses a template-based layout system with two primary options. **You must choose ONE template for the entire application and use it consistently across all routes.**

### Available Layout Templates

#### BASEPAGE Layout (`../../../docs/BASEPAGE_TEMPLATE_GUIDE.md`)

**Best for**:

- **Marketing pages** (landing, about, pricing)
- **Simple content pages** (blog posts, documentation)
- **Forms and auth pages** (login, register, contact)
- **Public-facing content** that needs maximum screen space

**Requirements**:

- **Must create a header component** for navigation
- Header should use Container component for consistent alignment
- Provides maximum content area without sidebar constraints

#### BASEPAGE_WITH_SIDEBAR Layout (`../../../docs/BASEPAGE_WITH_SIDEBAR_TEMPLATE_GUIDE.md`)

**Best for**:

- **Admin dashboards** with multiple sections
- **Settings pages** with category navigation
- **Multi-step workflows** requiring section navigation
- **Data management interfaces** (users, products, reports)

**Requirements**:

- **Use the sidebar for primary navigation**
- Automatically collapses to mobile drawer on small screens
- Content area is constrained by sidebar presence

### Template Selection Rules

- **Choose ONE template** and apply it to ALL routes (see `../../../docs/TEMPLATE_GUIDE.md`)
- **Consistent layout structure** across the entire application
- **Always add proper padding** for main content areas
- **Ensure horizontal alignment** between header/sidebar and main content

## Layout Alignment & Spacing

### Consistent Max-Width Definition

- **Use Container component**: From `../../shared/ui` for all layout sections
- **Container handles**: max-width (`max-w-screen-2xl`), padding (`px-4 sm:px-6 lg:px-8`), spacing (`space-y-8 py-8`)
- **Header and main content must use identical Container component**

### Container Usage Examples

```tsx
import { Container } from '@src/shared/ui';

// ✅ Correct: Using Container component consistently
<Header /> {/* Header component should use Container internally */}

<main className="flex-1">
  <Container>
    {/* Main content */}
  </Container>
</main>

// ✅ Alternative: Manual container usage (if no Header component exists)
<header className="w-full">
  <Container className="py-4"> {/* Header-specific container styling */}
    {/* Header content */}
  </Container>
</header>

<main className="flex-1">
  <Container>
    {/* Main content */}
  </Container>
</main>

// ❌ Wrong: Manual div containers instead of Container component
<header className="px-6"> {/* Inconsistent padding */}
<main className="max-w-6xl"> {/* Different max-width */}
```

### Spacing Patterns

- **Page sections**: `space-y-8` or `space-y-12`
- **Component groups**: `space-y-6`
- **Related elements**: `space-y-4`
- **Form elements**: `space-y-3`

```tsx
// ✅ Correct spacing hierarchy
<div className="space-y-12">
  {' '}
  {/* Page sections */}
  <section className="space-y-6">
    {' '}
    {/* Section content */}
    <div className="space-y-4">
      {' '}
      {/* Related elements */}
      <h2>Section Title</h2>
      <p>Section description</p>
    </div>
  </section>
</div>
```

## Responsive Behavior

### Mobile Layout Considerations

- **Sidebar layouts**: Automatically collapse to mobile drawer
- **Header navigation**: Convert to hamburger menu on mobile
- **Container padding**: Reduced on mobile (`px-4`) vs desktop (`px-8`)
- **Content spacing**: Smaller gaps on mobile screens

### Responsive Implementation

```tsx
// ✅ Responsive spacing
<div className="space-y-6 md:space-y-8 lg:space-y-12">
  <div className="px-4 sm:px-6 lg:px-8">
    {/* Content adapts to screen size */}
  </div>
</div>
```

## Component Integration

### Shared UI Component Usage

- **All layouts must use components from `../../src/shared/ui`**
- **Never modify shared components** - extend through composition
- **Never add className props** to shared components

### Layout-Component Integration Patterns

```tsx
// ✅ Correct: Layout works with shared components
import { Button, Card, Container } from '@src/shared/ui';

const PageContent = () => (
  <Container>
    <Card>
    <Button>Action</Button> {/* No className modification */}
    </Card>
  </Container>
);

// ✅ Header component should be created as:
const Header = () => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <Container className="py-4 space-y-0"> {/* Override default spacing for header */}
    {/* Navigation content */}
    </Container>
  </header>
);

// ❌ Wrong: Manual container instead of Container component
<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">

// ❌ Wrong: Modifying shared components
<Button className="custom-style">Action</Button>
```

### Card Usage in Layouts

- **Use sparingly** - only for grouping related information
- **Avoid for**: Single forms, navigation, headers, simple lists
- **Use for**: Dashboard widgets, product cards, grouped form sections

## Visual Hierarchy Standards

### Header Structure Requirements

- **One h1 per page** - typically the page title
- **Sequential nesting** - h1 → h2 → h3 (no skipping levels)
- **Logical structure** - reflects content importance

### Content Hierarchy Example

```tsx
<main>
  <h1>Page Title</h1> {/* Main page title */}
  <section>
    <h2>Section Title</h2> {/* Major section */}
    <div>
      <h3>Subsection</h3> {/* Within section */}
      <h4>Details</h4> {/* Specific details */}
    </div>
  </section>
</main>
```

### Spacing Over Containers

- **Prefer spacing** over cards for content separation
- **Use margins/padding** instead of unnecessary containers
- **Inner spacing < outer spacing** for proper visual grouping

## Layout Completion Checklist

### Template & Structure Validation

- [ ] Selected ONE template system (BASEPAGE or BASEPAGE_WITH_SIDEBAR) for entire application
- [ ] All pages use the same layout template consistently
- [ ] Header and main content are horizontally aligned
- [ ] Consistent max-width applied (`max-w-screen-2xl`)

### Content Standards

- [ ] Consistent padding patterns (`px-4 sm:px-6 lg:px-8`)
- [ ] Proper spacing hierarchy implemented
- [ ] Visual hierarchy with correct header nesting
- [ ] No placeholder content or non-functional elements

### Component Integration

- [ ] Only uses shared UI components from `../..src/shared/ui`
- [ ] No className modifications on shared components
- [ ] Cards used appropriately (not for simple content)
- [ ] Responsive behavior tested on mobile and desktop
