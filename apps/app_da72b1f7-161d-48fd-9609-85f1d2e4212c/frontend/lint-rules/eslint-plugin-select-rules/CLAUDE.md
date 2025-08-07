# eslint-plugin-select-rules

ESLint plugin to enforce best practices for Select components and prevent common errors.

## Rules

### `no-empty-select-item-value`

Prevents using empty string values in `SelectItem` components, which causes runtime errors.

**Rule Details**

This rule disallows empty string values in `SelectItem` components because they conflict with the Select component's internal clearing mechanism.

**Examples**

❌ **Incorrect** code for this rule:

```jsx
<SelectItem value="">All options</SelectItem>
<SelectItem value={""}>Default</SelectItem>
<SelectItem value={``}>None</SelectItem>
```

✅ **Correct** code for this rule:

```jsx
<SelectItem value="all">All options</SelectItem>
<SelectItem value="default">Default</SelectItem>
<SelectItem value="none">None</SelectItem>

// Or use placeholder text instead
<Select>
  <SelectTrigger>
    <SelectValue placeholder="All options" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

## Installation

This plugin is included in the project template. To use it in your ESLint configuration:

```js
// eslint.config.js
import selectRules from './lint-rules/eslint-plugin-select-rules/index.js';

export default [
  {
    plugins: {
      'select-rules': selectRules,
    },
    rules: {
      'select-rules/no-empty-select-item-value': 'error',
    },
  },
];
```

## Recommended Configuration

Use the recommended configuration to enable all rules:

```js
// eslint.config.js
import selectRules from './lint-rules/eslint-plugin-select-rules/index.js';

export default [selectRules.configs.recommended];
```
