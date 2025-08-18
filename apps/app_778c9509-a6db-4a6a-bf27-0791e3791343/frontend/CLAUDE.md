# Client Coding & Architecture Guidelines

Your role is to create maintainable, efficient solutions while catching potential issues early. Act as a developer with deep expertise in modern web technologies. You are expected to make independent, well-informed technical decisions and deliver high-quality solutions without requiring step-by-step guidance.

## API Contract Architecture

**OpenAPI-First Development**

This frontend follows an OpenAPI-first approach. See `../shared/CLAUDE.md` for complete API contract guidelines, type generation, and OpenAPI specification details.

## CRITICAL WORKFLOW — ALWAYS FOLLOW THIS!

### OpenAPI-First → Research → Plan → Implement

**NEVER JUMP STRAIGHT TO CODING!** Always follow this sequence:

1. **OpenAPI-First**: Check `../shared/CLAUDE.md` for API contract guidelines, generate types if needed
2. **Research**: Explore the codebase, understand existing patterns
3. **🚨 VERIFY TEMPLATE PLACEHOLDERS**: Check index.html and site.webmanifest for `__APP_TITLE__` - MUST be replaced with actual application name!
4. **Plan**: Create a detailed implementation plan and verify it with me
5. **Implement**: Execute the plan with validation checkpoints

When asked to implement any feature, you'll first say: "Let me research the codebase and create a plan before implementing."

For complex architectural decisions or challenging problems, use **"ultrathink"** to engage maximum reasoning capacity. Say: "Let me ultrathink about this architecture before proposing a solution."

### Reality Checkpoints

**Stop and validate** at these moments:

- After implementing a complete feature
- Before starting a new major component or feature
- When something feels wrong
- Before declaring "done"

Run: - `pnpm build`

> Why: You can lose track of what's actually working. These checkpoints prevent cascading failures.

### 🚨 AUTOMATED CHECKS ARE MANDATORY

**ALL hook issues are BLOCKING — EVERYTHING must be ✅ GREEN!**

When hooks report ANY issues (exit code 2):

1. **STOP IMMEDIATELY** — Do not continue with other tasks
2. **FIX ALL ISSUES** — Address every ❌ issue (formatting, linting, forbidden patterns)
3. **VERIFY THE FIX** — Re-run the failed command to confirm
4. **CONTINUE ORIGINAL TASK** — Return to what you were doing

**Your code must be 100% clean. Zero tolerance for warnings or errors.**

## TypeScript-Specific Rules

### FORBIDDEN — NEVER DO THESE:

- **NO** any - use concrete types!
- **NO** keeping old and new code together
- **NO** migration functions or compatibility layers
- **NO** versioned function names (processV2, handleNew)
- **NO** complex error class hierarchies
- **NO** TODOs in final code
- **NO** business data in components - ALWAYS use API calls for domain entities
- **NO** mock data for business entities - ALWAYS fetch actual data from backend
- **NO** placeholder content - ALWAYS implement full API integration

> When you see `❌ FORBIDDEN PATTERN`, you MUST fix it immediately!

### Required Standards:

- **Delete** old code when replacing it
- **Always check** that there is no TODO in the code before declaring "done"
- **Meaningful names**: `userID` not `id`
- **Early returns** to reduce nesting
- **Always use** `pnpm` to add packages
- **Always use** `pnpm` to run scripts
- **Always use** components from `src/shared/ui` as a component library, never change these components
- **Always use** all created components
- **Always use** `useMemo` for complex objects, arrays, or computations passed to child components to prevent unnecessary re-renders
- **Always use** `useCallback` for event handlers and functions passed as props to prevent unnecessary re-renders
- **Always use** `React.memo` for functional components to prevent unnecessary re-renders
- **Always use** `useMemo` for complex values passed as children prop

## State Management Guidelines

- Use **React's `useState`** for local UI state inside components (e.g., modals, form inputs, toggles).
- Use **TanStack Query** (`useQuery`, `useMutation`) for all server-side state: fetching, caching, syncing with backend.
- Use **Zustand** only for global states.
- Never mix TanStack Query with any other state libraries unless a specific exception is given.
- Do **not use Zustand** for managing forms. Use `react-hook-form` for handling forms.

### Zustand Store Usage Rules:

**CRITICAL**: To prevent infinite loops and unnecessary re-renders:

- **NEVER** return objects from Zustand selectors (even single property objects):

  ```tsx
  // ❌ WRONG - Never return objects (causes re-renders)
  const { filter, setFilter } = useTodoStore(state => ({
    filter: state.filter,
    setFilter: state.setFilter,
  }));

  // ❌ WRONG - Even single property objects cause re-renders
  const { isAuthenticated } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
  }));
  ```

- **ALWAYS** select individual values directly:
  ```tsx
  // ✅ CORRECT - Always select individual values
  const filter = useTodoStore(state => state.filter);
  const setFilter = useTodoStore(state => state.setFilter);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  ```

This applies to ALL Zustand store usage throughout the application.

## Routing Guidelines

- **Always** include a route handler for "/"
- Use `Navigate` component to redirect to the primary page in case of no route handler for "/"
- Include catch-all route (\*) for undefined paths.

For example:

```tsx
<Routes>
  {/* Redirect root to primary page when no page for "/* is needed */}
  <Route path="/" element={<Navigate to="/dashboard" replace />} />

  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/settings" element={<Settings />} />

  {/* Catch undefined routes */}
  <Route path="*" element={<Navigate to="/dashboard" replace />} />
</Routes>
```

## UI requirements

- **Never** use stubs or placeholders. Use actual components
- **Never** create popups that are shown when you click or focus on the input
- **Never** creates buttons without functionality
- **Never** creates links that point to not existing routes
- **Never** use the className attribute with components from @src/shared/ui
- **If there are no valid options** that can be selected by the user use disabled prop on the `<select>`

## Card Usage Guidelines:

- **Use cards sparingly** only when grouping related information that needs visual separation
- **Avoid cards for**:
  - Single forms (use direct placement on page)
  - Navigation menus
  - Page headers or titles
  - Simple lists that don't need separation
  - Tables
- **Use cards for**:
  - Dashboard widgets with distinct metrics
  - Product/item cards in grids
  - Grouped form sections with different contexts

## Visual Hierarchy:

- Use spacing (margins/paddings) instead of cards for content separation
- Use spacing as the primary method to separate components and component groups. Inner spacing (between elements within a group) should be smaller than the spacing between the group and its sibling groups.
- Establish a logical content hierarchy using HTML headers (h1-h6) that reflects document structure and importance. Use only one h1 per document. Maintain sequential nesting without skipping levels. Example: page uses h1 title, first-level sections use h2, sections inside those use h3 etc.

## Our code is complete when:

- [ ] All linters pass with zero issues
- [ ] App built without errors
- [ ] **🚨 NO TEMPLATE PLACEHOLDERS** - `__APP_TITLE__` replaced in index.html and site.webmanifest
- [ ] Feature works end-to-end
- [ ] Old code is deleted
- [ ] All components have a single responsibility
- [ ] All pages use the same layout structure
- [ ] The generated code follows Feature Sliced Design(FSD). `docs/FSD_STRUCTURE.md`
- [ ] All API calls use generated types from ../shared folder
- [ ] No hardcoded types for API responses or requests

## Documentation

Read the relevant documentation before completing the tasks. Use the mcp server to get information on the following technologies:

- Shadcn UI
- Tailwind CSS
- Feature-Sliced Design (FSD)
- React
- React Router
- Typescript
- Vite
- TanStack Query
- Zustand
- React Hook Form
- OpenAPI Specification
