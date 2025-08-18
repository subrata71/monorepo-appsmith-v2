# Database Layer

This directory contains the database layer implementation using Drizzle ORM and SQL migrations.

## Structure

```
db/
├── migrations/     # SQL migration files
├── migrations.ts   # Custom migration runner
└── schema.ts       # Drizzle ORM schema definitions
```

## Key Components

### Schema (`schema.ts`)
- Drizzle ORM table definitions
- Type-safe database schema
- Used for application code database operations

### Migrations (`migrations/`)
- SQL files for database schema changes
- Naming convention: `XXX-descriptive-name.sql`
- Applied in alphabetical order
- Tracked in `migration_log` table

### Migration Runner (`migrations.ts`)
- Custom TypeScript migration system
- Reads SQL files from `migrations/` directory
- Tracks applied migrations
- Runs automatically on app startup

## Migration Standards

### Idempotency
- Use `IF NOT EXISTS` for tables, indexes, and types
- Use `CREATE OR REPLACE` for functions
- Use `DROP ... IF EXISTS` before creating triggers

### Table Structure
```sql
CREATE TABLE IF NOT EXISTS example_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- business fields here --
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_example_table_created_at ON example_table(created_at);
CREATE INDEX IF NOT EXISTS idx_example_table_updated_at ON example_table(updated_at);
```

### Triggers
```sql
DROP TRIGGER IF EXISTS update_example_table_updated_at ON example_table;
CREATE TRIGGER update_example_table_updated_at
    BEFORE UPDATE ON example_table
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Data Separation and Safety
- **NEVER** mix DDL (schema changes) with sample data in the same migration
- Create separate migrations for schema and sample data: `001-create-tables.sql`, `002-sample-data.sql`
- If sample data insertion fails, it should not prevent the app from starting
- Sample data migrations should be optional and recoverable

### UUID Handling
- **ALWAYS** use `gen_random_uuid()` for generating UUIDs (available by default in PostgreSQL 13+)
- **NEVER** hardcode UUID strings in migrations (prone to typos and validation errors)
- **NEVER** use extension-dependent functions like `uuid_generate_v5()` (requires uuid-ossp extension)
```sql
-- Good: Use built-in PostgreSQL function
INSERT INTO users (id, email) VALUES 
    (gen_random_uuid(), 'admin@example.com');

-- Bad: Hardcoded UUID (prone to typos)
INSERT INTO users (id, email) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@example.com');

-- Bad: Extension-dependent (may not be available)
INSERT INTO users (id, email) VALUES 
    (uuid_generate_v5(uuid_ns_dns(), 'admin@example.com'), 'admin@example.com');
```

### Data Types and Operators
- Use **JSONB** instead of JSON for better performance and operator support
- Avoid complex, non-standard operators (GIN, complex indexes) unless absolutely necessary
- Prefer standard PostgreSQL data types: TEXT, INTEGER, TIMESTAMP, BOOLEAN, UUID
- When using JSON operations, ensure compatibility with JSONB:
```sql
-- Good: JSONB with standard operators
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Bad: JSON with incompatible operators
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config JSON, -- GIN indexes won't work properly
    search_vector tsvector -- Complex, avoid unless needed
);
```

### Sample Data Best Practices
- **AVOID** generating complex encoded data (bcrypt, JWT, etc.) directly in SQL
- Use simple, valid sample data that doesn't require special encoding

### Code Generation Rules
- **ALWAYS** generate table/column names in lowercase_with_underscores format
- **NEVER** use these PostgreSQL reserved words as table names: `user`, `order`, `group`, `table`, `key`, `value`, `role`, `type`
- Use `users`, `orders`, `user_groups`, `lookup_tables` instead
- **ALWAYS** use TEXT instead of VARCHAR(n) - PostgreSQL treats them identically
- **ALWAYS** use TIMESTAMPTZ instead of TIMESTAMP for any date/time columns
- **ALWAYS** add DEFAULT value when adding NOT NULL columns: `ADD COLUMN name TEXT NOT NULL DEFAULT 'value'`

### Required Column Standards
Every table must include these columns in this exact format:
```sql
CREATE TABLE example_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- business columns here --
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Foreign Key Generation
Always specify CASCADE behavior explicitly:
```sql
-- For user-owned data (delete when user is deleted)
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

-- For reference data (prevent deletion if referenced)  
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
```

### Status/Enum Pattern
Instead of ENUM types, always use TEXT with CHECK constraints:
```sql
-- Generate this pattern for status fields
status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'))
```

### Migration Rollback Considerations
- Design migrations to be atomic where possible
- Take into account migration rollback scenarios when writing them
- Document any manual cleanup steps if automatic rollback isn't possible

## Usage

### Running Migrations
Migrations run automatically on app startup. No manual migration command is needed.

### Adding New Tables
1. Create SQL migration in `migrations/`
2. Start the application (migrations run automatically)
3. Add Drizzle schema in `schema.ts`
4. Use in application code

### Health Check
The `/api/v1/health` endpoint includes migration status.

## Migration Log
Applied migrations are tracked in the `migration_log` table:
```sql
SELECT * FROM migration_log ORDER BY completed_at;
``` 