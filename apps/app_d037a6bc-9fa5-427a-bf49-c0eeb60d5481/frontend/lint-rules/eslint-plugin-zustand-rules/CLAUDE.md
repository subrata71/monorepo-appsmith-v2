# Custom ESLint Rules

This directory contains custom ESLint rules for the project.

## Zustand Rules

### `zustand-rules/no-object-selectors`

This rule prevents returning objects from Zustand store selectors. Any object return (even with single property) causes unnecessary re-renders because a new object is created on every call.

#### Rule Details

❌ **BAD** - Never return objects:

```tsx
// Multiple properties - causes infinite re-renders
const { filter, setFilter } = useTodoStore(state => ({
  filter: state.filter,
  setFilter: state.setFilter,
}));

// Single property - still causes unnecessary re-renders
const { isOpen } = useModalStore(state => ({
  isOpen: state.isOpen,
}));
```

✅ **GOOD** - Always select individual values:

```tsx
const filter = useTodoStore(state => state.filter);
const setFilter = useTodoStore(state => state.setFilter);
const isOpen = useModalStore(state => state.isOpen);
```

#### Why This Rule Exists

When you return an object from a Zustand selector, a new object is created on every render. This causes components to re-render even when the actual values haven't changed, because React sees a different object reference each time. By selecting individual values, Zustand can properly track changes and only trigger re-renders when the specific selected value actually changes.

#### Automatic Fixes

This rule is **autofixable**! Run `eslint --fix` to automatically convert simple single-property object selectors:

```tsx
// Before (will be automatically fixed) - Direct property access
const { isOpen } = useModalStore(state => ({
  isOpen: state.isOpen,
}));

// After (automatic fix)
const isOpen = useModalStore(state => state.isOpen);

// Before (will be automatically fixed) - Nested property access
const { theme } = useSettingsStore(state => ({ theme: state.ui.theme }));

// After (automatic fix)
const theme = useSettingsStore(state => state.ui.theme);
```

**Note**: The autofix handles single properties accessing both direct (`state.property`) and nested (`state.ui.theme`, `state.config.settings`) properties. Complex cases with multiple properties, computed properties, or methods will still show errors but require manual fixing.

#### Configuration

This rule is automatically enabled in the ESLint configuration with error severity:

```js
'zustand-rules/no-object-selectors': 'error'
```
