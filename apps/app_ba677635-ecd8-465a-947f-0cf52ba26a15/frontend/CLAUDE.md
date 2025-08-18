# Client Coding & Architecture Guidelines

We're building production-quality code together. Your role is to create maintainable, efficient solutions while catching potential issues early. Act as a developer with deep expertise in modern web technologies. You are expected to make independent, well-informed technical decisions and deliver high-quality solutions without requiring step-by-step guidance.

## 🚨 AUTOMATED CHECKS ARE MANDATORY

**ALL hook issues are BLOCKING — EVERYTHING must be ✅ GREEN!**
No errors. No formatting issues. No linting problems. Zero tolerance.
These are not suggestions. Fix ALL issues before continuing.

## CRITICAL WORKFLOW — ALWAYS FOLLOW THIS!

### Research → Plan → Implement

**NEVER JUMP STRAIGHT TO CODING!** Always follow this sequence:

1. **Research**: Explore the codebase, understand existing patterns
2. **Plan**: Create a detailed implementation plan and verify it with me
3. **Implement**: Execute the plan with validation checkpoints

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

### 🚨 CRITICAL: Hook Failures Are BLOCKING

**When hooks report ANY issues (exit code 2), you MUST:**

1. **STOP IMMEDIATELY** — Do not continue with other tasks
2. **FIX ALL ISSUES** - Address every ❌ issue until everything is ✅ GREEN
3. **VERIFY THE FIX** - Re-run the failed command to confirm it's fixed
4. **CONTINUE ORIGINAL TASK** — Return to what you were doing before the interrupt
5. **NEVER IGNORE** — There are NO warnings, only requirements

This includes:

- Formatting issues
- Linting violations
- Forbidden patterns (any)
- All other checks

**Your code must be 100% clean. No exceptions.**

**Recovery Protocol:**

- When interrupted by a hook failure, maintain awareness of your original task
- After fixing all issues and verifying the fix, continue where you left off
- Use the todo list to track both the fix and your original task

## USE MULTIPLE AGENTS!

Leverage subagents aggressively for better results:

- Spawn agents to explore different parts of the codebase in parallel
- Use different agents for:
  - Writing code
  - Run linter and fix errors or warnings
  - Run the build and fix errors
- For complex refactoring: One agent identifies changes, another implements them

## Go-Specific Rules

### FORBIDDEN — NEVER DO THESE:

- **NO** any - use concrete types!
- **NO** keeping old and new code together
- **NO** migration functions or compatibility layers
- **NO** versioned function names (processV2, handleNew)
- **NO** custom error struct hierarchies
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
- **Always use** components from @src/shared/ui as a component library, never change these components
- **Always use** all created components
- **Always use** TanStack Query for server state management

### Zustand Store Usage Rules:

**CRITICAL**: To prevent infinite loops and unnecessary re-renders:

- **NEVER** use object destructuring with multiple selectors in a single store call:

  ```tsx
  // ❌ WRONG - Never do this
  const { filter, setFilter } = useTodoStore(state => ({
    filter: state.filter,
    setFilter: state.setFilter,
  }));
  ```

- **ALWAYS** use separate calls for each piece of state:
  ```tsx
  // ✅ CORRECT - Always do this
  const filter = useTodoStore(state => state.filter);
  const setFilter = useTodoStore(state => state.setFilter);
  ```

This applies to ALL Zustand store usage throughout the application.

### Layout requirements

- **Always** choose one of the available layouts and use it for all routes. @docs/TEMPLATE_GUIDE.md
  - If you have selected the **BASEPAGE** layout, then you must create a header for navigation
  - If you have selected **BASEPAGE_WITH_SIDEBAR** then you should use the sidebar for navigation
- **Always** add paddings for the main content on the page
- **Never** use stubs or placeholders. Use actual components
- **Never** create popups that are shown when you click or focus on the input
- **Never** point to routes that don't exist
- **Never** creates buttons without functionality
- **Never** creates links that point to not existing routes
- **Never** use the className attribute with components from @src/shared/ui

### Layout Alignment:

- **Header and main content must ALWAYS be aligned horizontally** — use consistent max-width and padding
- Use a Container wrapper with consistent horizontal padding
- Apply the same max-width constraint to both header and main content areas

### Card Usage Guidelines:

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

### Visual Hierarchy:

- Main content should have a clear visual hierarchy without excessive containers
- Use spacing (margins/paddings) instead of cards for content separation
- Use spacing as the primary method to separate components and component groups. Inner spacing (between elements within a group) should be smaller than the spacing between the group and its sibling groups.
- Establish a logical content hierarchy using HTML headers (h1-h6) that reflects document structure and importance. Use only one h1 per document. Maintain sequential nesting without skipping levels. Example: page uses h1 title, first-level sections use h2, sections inside those use h3 etc.

### Our code is complete when:

- [ ] All linters pass with zero issues
- [ ] App built without errors
- [ ] Feature works end-to-end
- [ ] Old code is deleted
- [ ] All components have a single responsibility
- [ ] All pages use the same layout structure
- [ ] The generated code follows Feature Slide Design(FSD). @docs/FSD_STRUCTURE.md

## LLM Code Generation Rules

### MANDATORY Template Replacements

When starting ANY project or generating code, you MUST immediately replace:

- **{{APP_TITLE}}** in `index.html` → Replace with actual application name
- **{{APP_TITLE}}** in `public/assets/icons/site.webmanifest` → Replace with actual application name

Ask the user for the application name if not provided in context.

### File Generation Rules

- **NEVER** create files with placeholder content
- **ALWAYS** generate complete, working implementations
- **NEVER** use "TODO" or "PLACEHOLDER" in generated code

## Documentation

Read the relevant documentation before completing the tasks. Use the mcp server to get information on the following technologies:

- Shadcn UI
- Tailwind CSS
- Feature-Sliced Design (FSD)
- React
- React Router
- Typescript
- Vite
- Tanstack Query
- Zustand
- react-helmet
