# Custom ESLint Rules

This directory contains custom ESLint rules for the project.

## Zustand Rules

### `zustand-rules/no-multiple-selectors`

This rule prevents using object destructuring with multiple selectors in a single Zustand store call. This pattern can cause infinite loops and unnecessary re-renders.

#### Rule Details

❌ **BAD** - Never do this:
```tsx
const { filter, setFilter } = useTodoStore(state => ({
  filter: state.filter,
  setFilter: state.setFilter,
}));
```

✅ **GOOD** - Always do this:
```tsx
const filter = useTodoStore(state => state.filter);
const setFilter = useTodoStore(state => state.setFilter);
```

#### Why This Rule Exists

When you use object destructuring with multiple selectors, Zustand creates a new object on every render, which causes the component to re-render infinitely. By using separate calls, each selector only triggers re-renders when its specific value changes.

#### Configuration

This rule is automatically enabled in the ESLint configuration with error severity:

```js
'zustand-rules/no-multiple-selectors': 'error'
```