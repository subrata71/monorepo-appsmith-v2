# Template Guide

This guide provides templates and patterns for creating consistent, high-quality code across the application. Always reference these templates when implementing new features.

## 📄 Available Templates

### BasePage Template

**Documentation**: [BASEPAGE_TEMPLATE_GUIDE.md](./BASEPAGE_TEMPLATE_GUIDE.md)

The BasePage serves as the primary template for creating new pages. It demonstrates:

- Proper page structure and layout
- Data-driven content patterns
- Responsive design implementation
- Navigation patterns
- Component composition
- Mock data integration

### BasePageWithSidebar Template

**Documentation**: [BASEPAGE_WITH_SIDEBAR_TEMPLATE_GUIDE.md](./BASEPAGE_WITH_SIDEBAR_TEMPLATE_GUIDE.md)

The BasePageWithSidebar template is ideal for admin interfaces and multi-section applications. It demonstrates:

- Sidebar navigation implementation
- SidebarProvider integration
- Responsive sidebar behavior
- Active state management
- Action menu patterns
- Complex layout composition

### BaseHeader Template

**Documentation**: [HEADER_TEMPLATE_GUIDE.md](./HEADER_TEMPLATE_GUIDE.md)

The BaseHeader template provides a complete navigation header solution. It demonstrates:

- Sticky header with backdrop blur
- Data-driven navigation structure
- Dropdown menu patterns
- Application actions and settings menu
- Responsive mobile behavior
- Badge notifications

## 🎯 When to Use Templates

### Creating a New Page

1. Choose the appropriate template:

- **BasePage**: For standard pages with header/footer layout
- **BasePageWithSidebar**: For admin dashboards or multi-section interfaces

2. Copy the structure, not the content
3. Adapt patterns to your specific needs
4. Maintain the same quality standards

### Adding New Features

1. Look for existing patterns in the codebase
2. Follow established conventions
3. Use templates to ensure consistency
4. Don't reinvent patterns that already exist

## 🛠️ How to Use Templates

### Step 1: Identify the Right Template

- **Simple Page**: Use BasePage for marketing pages, landing pages, simple content
- **Dashboard/Admin**: Use BasePageWithSidebar for complex applications
- **Navigation Header**: Use BaseHeader for site navigation
- **Site Footer**: Use BaseFooter for page footers
- **Widget Creation**: Look at existing widgets
- **Feature Implementation**: Study similar features
- **Component Patterns**: Reference shared UI usage

### Step 2: Copy Structure, Not Content

```tsx
// ✅ Good: Copy the pattern
const items = [
  { id: 1, name: 'Item 1', value: 100 },
  { id: 2, name: 'Item 2', value: 200 },
];

// ❌ Bad: Copy irrelevant content
const features = [
  { icon: Users, title: 'Unified Customer Profiles' }, // Wrong context
];
```

### Step 3: Adapt to Your Use Case

- Rename variables meaningfully
- Adjust data structures as needed
- Modify layouts for your content
- Keep the core patterns intact

## 📋 Template Checklist

Before completing any implementation:

- [ ] Referenced appropriate template
- [ ] Followed established patterns
- [ ] Maintained code organization
- [ ] Used consistent naming
- [ ] Implemented proper error handling
- [ ] Added appropriate comments
- [ ] Validated with linters
- [ ] Tested the implementation

## 🔧 Common Patterns

### File Organization (FSD)

```
feature/
  ui/
    Component.tsx
  model/
    types.ts
    store.ts
  api/
    requests.ts
  index.ts
```

### Import Organization

```tsx
// 1. React and third-party
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 2. Shared UI components
import { Button, Card } from '@/shared/ui';

// 3. Icons
import { Users, Search } from 'lucide-react';

// 4. Local imports
import { useLocalHook } from '../model/hooks';
```

### Export Patterns

```tsx
// index.ts - Public API
export { ComponentName } from './ui/ComponentName';
export type { TypeName } from './model/types';
export { actionName } from './model/actions';
```

## 🚫 Anti-Patterns to Avoid

### Don't Create New Patterns

```tsx
// ❌ Wrong: Creating custom patterns
const MyCustomButton = styled.button`...`;

// ✅ Right: Use existing patterns
import { Button } from '@/shared/ui';
```

### Don't Mix Patterns

```tsx
// ❌ Wrong: Mixing different approaches
<div className="flex">
  <Button style={{ margin: '10px' }}>  // Don't mix inline styles
</div>

// ✅ Right: Consistent approach
<div className="flex gap-4">
  <Button>Click me</Button>
</div>
```

### Don't Ignore Conventions

```tsx
// ❌ Wrong: Ignoring naming conventions
const usr = {
  /* ... */
};
const getData = () => {
  /* ... */
};

// ✅ Right: Following conventions
const user = {
  /* ... */
};
const fetchUserData = () => {
  /* ... */
};
```

## 📚 Additional Resources

- [FSD_STRUCTURE.md](./FSD_STRUCTURE.md) - Architecture guidelines
- [BASEPAGE_TEMPLATE_GUIDE.md](./BASEPAGE_TEMPLATE_GUIDE.md) - Page creation guide
- `@/shared/ui` - Component library reference
- CLAUDE.md files - Project-specific instructions

## 💡 Tips for Success

1. **Study Before Building**: Always examine existing code first
2. **Ask When Unsure**: If a pattern isn't clear, investigate further
3. **Consistency Over Creativity**: Follow patterns even if you have "better" ideas
4. **Document Deviations**: If you must deviate, document why
5. **Test Thoroughly**: Templates are tested patterns - your code should be too

Remember: Templates exist to make development faster and more consistent. Use them as your foundation, not your limitation.
