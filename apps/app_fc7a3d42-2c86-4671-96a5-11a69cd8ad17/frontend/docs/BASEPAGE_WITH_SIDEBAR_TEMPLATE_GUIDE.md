# BasePageWithSidebar Template Guide

This guide explains how to use `BasePageWithSidebar` as a template for creating pages with sidebar navigation. This template is ideal for admin dashboards, application settings, and any multi-section interfaces.

## 📋 Quick Reference Checklist

When creating a new page with sidebar using this template:

- [ ] Wrap entire page in `SidebarProvider`
- [ ] Use `Sidebar` component for navigation area
- [ ] Use `SidebarInset` for main content area
- [ ] Include `SidebarTrigger` in content header
- [ ] Structure navigation data hierarchically
- [ ] Implement active state detection
- [ ] Handle responsive behavior properly
- [ ] Include user menu in sidebar footer
- [ ] Keep all sidebar items functional
- [ ] Test keyboard shortcut (Cmd/Ctrl + B)

## 🏗️ Sidebar Page Structure

```tsx
<SidebarProvider>
  <div className="flex h-screen w-full">
    <Sidebar>
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </Sidebar>

    <SidebarInset>
      <header>
        <SidebarTrigger />
        {/* Page header content */}
      </header>
      <main>{/* Page main content */}</main>
    </SidebarInset>
  </div>
</SidebarProvider>
```

## 🎨 Key Patterns Explained

### 1. SidebarProvider Wrapper

The entire page must be wrapped in `SidebarProvider`:

```tsx
<SidebarProvider defaultOpen>{/* Page content */}</SidebarProvider>
```

Features:

- Manages sidebar open/closed state
- Provides keyboard shortcuts (Cmd/Ctrl + B)
- Handles responsive behavior
- Persists state in cookies

### 2. Navigation Data Structure

Organize navigation items hierarchically:

```tsx
const navigationGroups = [
  {
    label: 'Main',
    items: [
      {
        icon: Home,
        title: 'Dashboard',
        href: '/',
        badge: null, // or string/number
      },
      // More items...
    ],
  },
  // More groups...
];
```

### 3. Active State Detection

Use React Router's `useLocation` to detect active items:

```tsx
const location = useLocation();
const isActive = location.pathname === item.href;

<SidebarMenuButton asChild isActive={isActive}>
  <Link to={item.href}>{/* Button content */}</Link>
</SidebarMenuButton>;
```

### 4. Sidebar Components Hierarchy

```
Sidebar
├── SidebarHeader          // Logo/branding
├── SidebarContent         // Scrollable area
│   └── SidebarGroup       // Logical grouping
│       ├── SidebarGroupLabel
│       └── SidebarGroupContent
│           └── SidebarMenu
│               └── SidebarMenuItem
│                   ├── SidebarMenuButton
│                   └── SidebarMenuBadge
└── SidebarFooter          // User menu/actions
```

### 5. Content Area with SidebarInset

`SidebarInset` handles proper spacing and responsive behavior:

```tsx
<SidebarInset>
  <header className="flex h-16 items-center gap-4 border-b px-6">
    <SidebarTrigger /> // Always include toggle button
    <h1>Page Title</h1>
  </header>
  <main className="flex-1 overflow-auto">
    <div className="container py-6">{/* Page content */}</div>
  </main>
</SidebarInset>
```

### 6. Badge Patterns

Add badges to menu items for notifications/counts:

```tsx
<SidebarMenuItem>
  <SidebarMenuButton>{/* ... */}</SidebarMenuButton>
  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
</SidebarMenuItem>
```

### 7. User Menu in Footer

Include user information and actions:

```tsx
<SidebarFooter>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton>{/* User avatar and info */}</SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
  <SidebarSeparator />
  <SidebarMenu>{/* User menu items */}</SidebarMenu>
</SidebarFooter>
```

## 📱 Responsive Behavior

The sidebar automatically adapts to screen sizes:

- **Desktop**: Sidebar visible by default, can be toggled
- **Tablet**: Sidebar starts collapsed, expands on demand
- **Mobile**: Sidebar appears as sheet/drawer overlay

## 🚀 Creating a New Page with Sidebar

### Step 1: Create Page Structure

```bash
src/pages/
  [page-name]/
    ui/
    [PageName].tsx
    index.ts
```

### Step 2: Copy BasePageWithSidebar Structure

```tsx
import { Link, useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  // ... other imports
} from '@/shared/ui';

export function [PageName]() {
  const location = useLocation();

  const navigationGroups = [
    // Your navigation structure
  ];

  return (
    <SidebarProvider defaultOpen>
    <div className="flex h-screen w-full">
        <Sidebar>
        {/* Sidebar content */}
        </Sidebar>
        <SidebarInset>
        {/* Main content */}
        </SidebarInset>
    </div>
    </SidebarProvider>
  );
}
```

### Step 3: Customize Navigation

Adapt the navigation structure to your needs:

```tsx
const navigationGroups = [
  {
    label: 'Content',
    items: [
      {
        icon: FileText,
        title: 'Articles',
        href: '/articles',
        badge: '120',
      },
      {
        icon: Image,
        title: 'Media',
        href: '/media',
        badge: null,
      },
    ],
  },
];
```

## 🔍 Common Patterns by Use Case

### Admin Dashboard

- Multiple navigation groups (Analytics, Management, Settings)
- Badges for pending items/notifications
- User role displayed in footer
- Quick stats in main content area

### Settings Interface

- Grouped settings categories in sidebar
- Active state shows current section
- Nested navigation for subsections
- Save/cancel actions in content header

### Multi-Step Workflow

- Steps as sidebar items
- Progress indicators via badges
- Disabled states for locked steps
- Navigation controls in content area

## ⚡ Advanced Features

### Collapsible Sidebar

The sidebar supports different collapse modes:

```tsx
<Sidebar collapsible="icon">  // Collapses to icon-only
<Sidebar collapsible="offcanvas">  // Slides off screen
<Sidebar collapsible="none">  // Always visible
```

### Nested Navigation

For sub-menus, use `SidebarMenuSub`:

```tsx
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuSub>
    <SidebarMenuSubItem>
      <SidebarMenuSubButton />
    </SidebarMenuSubItem>
  </SidebarMenuSub>
</SidebarMenuItem>
```

### Custom Actions

Add action buttons to menu items:

```tsx
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuAction showOnHover>
    <MoreHorizontal />
  </SidebarMenuAction>
</SidebarMenuItem>
```

## ⚠️ Important Rules

1. **No Dead Links**: All navigation items must have valid routes
2. **Complete Implementation**: No placeholder functionality
3. **Responsive Design**: Test on all screen sizes
4. **Keyboard Navigation**: Ensure accessibility
5. **Active States**: Always show current location
6. **Loading States**: Use `SidebarMenuSkeleton` when needed

## 📝 Example: Creating a Project Management Page

```tsx
export function ProjectManagement() {
  const location = useLocation();

  const navigationGroups = [
    {
      label: 'Projects',
      items: [
        {
          icon: Folder,
          title: 'All Projects',
          href: '/projects',
          badge: '24',
        },
        {
          icon: Star,
          title: 'Favorites',
          href: '/projects/favorites',
          badge: '5',
        },
        {
          icon: Archive,
          title: 'Archived',
          href: '/projects/archived',
          badge: null,
        },
      ],
    },
    {
      label: 'Team',
      items: [
        {
          icon: Users,
          title: 'Members',
          href: '/team/members',
          badge: '12',
        },
        {
          icon: UserPlus,
          title: 'Invitations',
          href: '/team/invitations',
          badge: '3',
        },
      ],
    },
  ];

  return (
    <SidebarProvider defaultOpen>
      {/* Rest of implementation following the pattern */}
    </SidebarProvider>
  );
}
```

## 📝 Example: Using with Router

```tsx
{
  /* Sidebar layout example - no wrapper needed */
}
<Route path="/sidebar-example" element={<BasePageWithSidebar />} />;
```

This template provides a complete foundation for building complex multi-page applications with consistent navigation patterns.
