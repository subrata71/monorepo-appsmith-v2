# Database Layer

Drizzle ORM with SQL migrations and automatic schema tracking.

## Structure

```
db/
├── migrations/     # SQL migration files
├── migrations.ts   # Migration runner
├── connection.ts   # Database connection
└── schema.ts       # Drizzle schema definitions
```

## Migration Standards

### Required Table Structure

```sql
CREATE TABLE IF NOT EXISTS example_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- business fields here --
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Key Rules

- **Never modify existing migrations**
- **Use `IF NOT EXISTS` for tables, indexes, types**
- **Use `CREATE OR REPLACE` for functions**
- **Use `DROP ... IF EXISTS` before triggers**
- **Always use `gen_random_uuid()` for UUIDs (never hardcode)**
- **Use JSONB instead of JSON**
- **Use TEXT instead of VARCHAR**
- **Use TIMESTAMPTZ instead of TIMESTAMP**
- **Add DEFAULT when adding NOT NULL columns**
- **NEVER use PostgreSQL reserved keywords as column names** (see Reserved Keywords section)
- **NEVER add migration logging statements** - migrations are tracked automatically

### Naming Conventions

- **Table names**: lowercase_with_underscores
- **Column names**: lowercase_with_underscores

### Reserved Keywords to Avoid

Common PostgreSQL reserved keywords that CANNOT be used as column names:

- `constraint`, `check`, `default`, `primary`, `foreign`, `key`, `references`
- `select`, `insert`, `update`, `delete`, `create`, `drop`, `alter`
- `table`, `column`, `index`, `trigger`, `function`, `procedure`
- `user`, `role`, `group`, `order`, `limit`, `offset`
- `where`, `having`, `union`, `join`, `on`, `as`
- `null`, `true`, `false`, `and`, `or`, `not`

**If you must use a reserved word, quote it**: `"constraint"`
**Better practice**: Use alternative names like `constraints`, `user_role`, `sort_order`, `users`, `orders`, `user_groups`

### Status/Enum Pattern

```sql
status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'))
```

### Foreign Keys

```sql
-- User-owned data (delete when user deleted)
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

-- Reference data (prevent deletion if referenced)
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
```

### Data Separation

- **NEVER mix DDL with sample data in same migration**
- **Separate migrations**: `001-create-tables.sql`, `002-sample-data.sql`
- **Sample data should be optional and recoverable**

### Migration Logging

- **NEVER manually add INSERT statements to migration_log**
- **NEVER add migration tracking code at the end of migrations**
- **Migration logging is handled automatically by the migration runner**
- **The migration_log table structure is:**
  ```sql
  migration_log (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      sql_content TEXT NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  ```

## Usage

- Migrations run automatically on app startup
- Add SQL file to `migrations/` directory
- Add Drizzle schema to `schema.ts`
- Use in application code
