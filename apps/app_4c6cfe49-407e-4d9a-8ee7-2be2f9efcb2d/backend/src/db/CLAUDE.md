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

### Naming Conventions
- **Table names**: lowercase_with_underscores
- **Avoid reserved words**: `user`, `order`, `group`, `table`, `key`, `value`, `role`, `type`
- **Use**: `users`, `orders`, `user_groups`, `lookup_tables`

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

## Usage

- Migrations run automatically on app startup
- Add SQL file to `migrations/` directory
- Add Drizzle schema to `schema.ts`
- Use in application code
