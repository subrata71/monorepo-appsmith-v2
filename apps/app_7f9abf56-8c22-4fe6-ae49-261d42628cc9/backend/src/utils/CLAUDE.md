# Utilities

Utility functions and helpers used throughout the application.

## Environment Utilities (`env.ts`)

**Preferred way to access environment variables** instead of directly using `process.env.NODE_ENV`.

### Usage

```typescript
import { getEnvironment } from '../utils/env.js';

const env = getEnvironment(); // 'development', 'production', or 'test'
```

**Note**: Use `getEnvironment()` instead of `process.env.NODE_ENV` for consistent environment handling.
