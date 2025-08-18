# Database Seeds

This directory contains database seed files for populating tables with initial
data.

## Structure

```
seeds/
├── index.ts                    # Main orchestrator with environment logic
├── seed-runner.ts              # Seed runner (follows migration pattern)
├── sql_files/                  # SQL seed files
│   └── 001-seed-__entityPlural__.sql    # Seed data for __entityPlural__ table
```

**Note**: Seeds use SQL files and follow the same pattern as migrations, making
them flexible for schema changes.

## Adding New Table Seeds

To add seed data for a new table:

1. **Create a new numbered SQL seed file** with a verb (e.g.,
   `002-seed-users.sql`):

```sql
-- Seed data for users table
INSERT INTO users (name, email) VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com');
```

2. **That's it!** The seed runner will automatically:
   - Find the new seed file
   - Run it if it hasn't been run before
   - Log its completion

### Naming Convention

- Use verbs in seed filenames: `001-seed-users.sql`,
  `002-update-users-add-role.sql`
- Files are processed in alphabetical order

## Handling Schema Changes

When table schemas change, you can create new seed files to update existing
data:

```sql
-- 003-update-__entityPlural__-add-email.sql
UPDATE __entityPlural__ SET email = 'item1@example.com' WHERE name = 'Sample Item 1';
UPDATE __entityPlural__ SET email = 'item2@example.com' WHERE name = 'Sample Item 2';

-- 004-add-new-__entityPlural__-with-email.sql
INSERT INTO __entityPlural__ (name, email) VALUES
  ('New Item with Email', 'new@example.com');
```

### File-Based Seed Tracking:

The system automatically tracks whether each seed file has been run using a
`seed_log` table (created by migration):

- File-based tracking - each seed file runs once
- No need to check individual tables for existing data
- Automatic tracking across all environments
- Table is created as part of the database schema migration
- Follows the same pattern as database migrations
- New seed files will run automatically when added

## Running Seeds

Seeds run automatically during application startup after migrations complete.

### Programmatic usage:

```typescript
import { runSeeds } from './seeds/index.js';
await runSeeds();
```

**Note**: The `APP_DATABASE_URL` environment variable must be set.

## Features

- **SQL-based**: Uses SQL files for maximum flexibility
- **Schema-change friendly**: Easy to handle table schema updates
- **Idempotent**: Seeds can be run multiple times safely
- **Transactional**: Each seed file runs in its own transaction
- **Logging**: Clear console output for debugging
- **Error handling**: Proper error handling and cleanup

## Best Practices

1. **Use numbered filenames** (001, 002, etc.) for proper ordering
2. **Use meaningful sample data** that represents real-world scenarios
3. **Keep seed data minimal** - just enough for development/testing
4. **Document any special requirements** in the seed file comments
5. **Use descriptive filenames with verbs** (e.g., `002-seed-users.sql`,
   `003-update-users-add-role.sql`)
6. **Use transactions** - each seed file runs in its own transaction
