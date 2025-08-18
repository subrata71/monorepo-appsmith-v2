# Header Template Guide

This guide explains how to use `BaseHeader` as a template for creating navigation headers. This component demonstrates best practices for layout, navigation, and responsive design.

## 📋 Quick Reference Checklist

When creating headers using this template:

**Header Checklist:**

- [ ] Use sticky positioning with backdrop blur
- [ ] Include brand/logo section
- [ ] Implement data-driven navigation
- [ ] Add responsive behavior
- [ ] Include user actions and profile menu
- [ ] Test dropdown interactions
- [ ] Handle mobile menu toggle

## 🏗️ Header Component Structure

### Basic Header Template

```tsx
<header className="sticky top-0 z-50 backdrop-blur">
  <Container>
    <div className="flex items-center justify-between">
      {/* Brand Section */}
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Brand />
        </Link>
      </div>

      {/* Navigation */}
      <NavigationMenu>{/* Navigation items */}</NavigationMenu>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {/* User menu and actions */}
      </div>
    </div>
  </Container>
</header>
```

### Navigation Data Structure

```tsx
const mainNavigation = [
  {
    type: 'link',
    label: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    type: 'dropdown',
    label: 'Customers',
    icon: Users,
    items: [
      {
        title: 'All Customers',
        href: '/customers',
        description: 'View and manage all customer records',
        icon: Users,
      },
      // More items...
    ],
  },
];
```

## 🎨 Key Patterns Explained

### 1. Sticky Header with Backdrop Blur

Creates a modern glass effect header that stays visible while scrolling:

```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
```

Features:

- `sticky top-0`: Stays at top while scrolling
- `z-50`: High z-index to stay above content
- `backdrop-blur`: Modern glass effect
- `bg-background/95`: Semi-transparent background

### 2. Navigation Menu Patterns

#### Simple Link Navigation

```tsx
<NavigationMenuItem>
  <NavigationMenuLink asChild>
    <Link to={item.href}>
      <Icon className="mr-2 h-4 w-4" />
      {item.label}
    </Link>
  </NavigationMenuLink>
</NavigationMenuItem>
```

#### Dropdown Navigation

```tsx
<NavigationMenuItem>
  <NavigationMenuTrigger>
    <Icon className="mr-2 h-4 w-4" />
    {item.label}
  </NavigationMenuTrigger>
  <NavigationMenuContent>
    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
      {item.items.map(subItem => (
        <li key={subItem.href}>
          <NavigationMenuLink asChild>
            <Link to={subItem.href}>
              <Icon className="h-4 w-4" />
              <div>
                <div className="font-medium">{subItem.title}</div>
                <p className="text-sm text-muted-foreground">
                  {subItem.description}
                </p>
              </div>
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  </NavigationMenuContent>
</NavigationMenuItem>
```

### 3. User Actions with Badges

Show notification counts and user actions:

```tsx
<Button variant="outline" size="sm" asChild className="relative">
  <Link to="/notifications">
    <Bell className="h-4 w-4 mr-2" />
    Notifications
    {badge && (
      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5">
        {badge}
      </Badge>
    )}
  </Link>
</Button>
```

### 4. User Profile Menu

Include user information and account actions:

```tsx
<NavigationMenuItem>
  <NavigationMenuTrigger>
    <Avatar />
  </NavigationMenuTrigger>
  <NavigationMenuContent>
    <div className="w-[280px] p-4">
      {/* User Info Header */}
      <div className="flex items-center space-x-3 pb-3 border-b">
        <Avatar />
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Menu Items */}
      <ul className="space-y-1 pt-3">
        {userMenuItems.map(item => (
          <li key={item.href}>
            <Link to={item.href}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </NavigationMenuContent>
</NavigationMenuItem>
```

## 🚀 Creating Custom Headers

### Step 1: Copy Template Structure

Start with the BaseHeader structure:

```tsx
// For headers
import { BaseHeader } from '@/widgets/base-header';
```

### Step 2: Customize Navigation Data

Adapt the navigation structure to your needs:

```tsx
const mainNavigation = [
  {
    type: 'link',
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    type: 'dropdown',
    label: 'Products',
    icon: Package,
    items: [
      {
        title: 'Product A',
        href: '/products/a',
        description: 'Description of Product A',
        icon: Zap,
      },
      // More products...
    ],
  },
];
```

### Step 3: Update Brand Information

Customize brand elements:

```tsx
<Link to="/" className="flex items-center space-x-2">
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
    <YourIcon className="h-4 w-4" />
  </div>
  <span className="font-bold">Your Brand</span>
</Link>
```

## 📱 Mobile Considerations

### Header Mobile Menu

Add mobile menu toggle:

```tsx
<Button
  variant="ghost"
  size="icon"
  className="md:hidden"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  <Menu className="h-5 w-5" />
</Button>
```

## ⚡ Advanced Features

### Mega Menu

For complex navigation structures:

```tsx
<NavigationMenuContent>
  <div className="w-[800px] p-6">
    <div className="grid grid-cols-3 gap-6">{/* Multiple column layout */}</div>
  </div>
</NavigationMenuContent>
```

### Search Integration

Add search functionality:

```tsx
<div className="flex items-center space-x-4">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <input
      type="text"
      placeholder="Search..."
      className="pl-10 pr-4 py-2 border rounded-md"
    />
  </div>
</div>
```

## ⚠️ Important Rules

1. **Always use NavigationMenu**: For accessibility and keyboard navigation
2. **Test responsive behavior**: Ensure mobile usability
3. **Include proper ARIA labels**: For screen readers
4. **Use semantic HTML**: header, nav elements
5. **Optimize for performance**: Avoid heavy components in headers
6. **Test dropdown interactions**: Ensure proper focus management

## 🔍 Common Use Cases

### Corporate Website Header

- Simple navigation with dropdowns
- Contact information
- User account access

### SaaS Application Header

- Dashboard navigation
- User notifications
- Profile management
- Search functionality

### E-commerce Header

- Product categories
- Shopping cart
- User account
- Search bar

These templates provide a solid foundation for creating consistent, accessible, and user-friendly navigation components across your application.
