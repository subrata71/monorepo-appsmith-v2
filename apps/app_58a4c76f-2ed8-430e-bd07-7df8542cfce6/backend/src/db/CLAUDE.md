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

## Quick Reference - Most Critical Rules

1. **NEVER hardcode UUIDs** - Always use `gen_random_uuid()` or omit ID
2. **NEVER use MySQL INDEX syntax** - Create indexes separately
3. **ALWAYS validate foreign keys exist** - Use JOINs, not subqueries in VALUES
4. **ALWAYS use IF NOT EXISTS** - For tables, indexes, types
5. **NEVER modify existing migrations** - Create new migration to change
6. **ALWAYS handle NULL constraints** - Provide defaults or validate existence
7. **Default to transactions; split exceptions** - Use `BEGIN/COMMIT` by default. For statements that cannot run inside a transaction (e.g., `CREATE INDEX CONCURRENTLY`, `ALTER TYPE ... ADD VALUE`), place them in a separate migration file without a transaction.
8. **NEVER assume external data exists** - Validate or create dependencies first

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

### Transaction Safety

The migration runner wraps each migration file in a transaction by default, making the whole file atomic.

- Do NOT add explicit `BEGIN/COMMIT` blocks inside migration files.
- For statements that cannot run inside a transaction, place them in a separate migration file and add a `-- NO_TRANSACTION` header at the top (the migration runner recognizes this and will not wrap it in a transaction).
- Common non-transactional statements (non-exhaustive):
  - `CREATE INDEX CONCURRENTLY` / `DROP INDEX CONCURRENTLY`
  - `REINDEX CONCURRENTLY`
  - `REFRESH MATERIALIZED VIEW CONCURRENTLY`
  - `ALTER TYPE ... ADD VALUE`
  - `VACUUM`, `VACUUM FULL`, `CLUSTER`
  - `CREATE DATABASE`, `ALTER SYSTEM`

Typical migration file (no explicit transaction blocks needed):

```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- More statements here
```

Non-transactional examples (separate migration files; do not wrap in BEGIN/COMMIT). Add a header directive to be explicit:

```sql
-- NO_TRANSACTION
-- Cannot run inside a transaction block
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users (email);
```

```sql
-- NO_TRANSACTION
-- Cannot run inside a transaction block
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'user_status' AND e.enumlabel = 'archived'
  ) THEN
    ALTER TYPE user_status ADD VALUE 'archived';
  END IF;
END $$;
```

### ⚠️ CRITICAL ERROR PREVENTION

These are the most common errors that WILL break your migrations:

1. **NULL constraint violations**: When foreign key subqueries return NULL because referenced records don't exist
2. **Foreign key failures**: Assuming external records exist without validation
3. **Hardcoded UUID conflicts**: Using same UUIDs across environments or runs
4. **UUID type casting errors**: `operator does not exist: uuid = text` when using hardcoded UUIDs in VALUES
5. **MySQL syntax in PostgreSQL**: Using `INDEX` inside `CREATE TABLE` statements
6. **Missing transactions**: Not wrapping DDL changes in BEGIN/COMMIT
7. **Case sensitivity issues**: PostgreSQL identifiers are case-sensitive when quoted
8. **Constraint naming conflicts**: Using default constraint names that conflict

### Key Rules

- **Default to transactions**: Use `BEGIN;` and `COMMIT;` unless using statements that cannot run in a transaction (see Transaction Safety)
- **Never modify existing migrations**
- **Use `IF NOT EXISTS` for tables, indexes, types**
- **Use `CREATE OR REPLACE` for functions**
- **Use `DROP ... IF EXISTS` before triggers**
- **UUIDs**: Never hardcode. Use `gen_random_uuid()` or omit the id; for related data use CTEs/joins. See "UUID Generation and Seed Data".
- **Use JSONB instead of JSON**
- **Use TEXT instead of VARCHAR**
- **Use TIMESTAMPTZ instead of TIMESTAMP**
- **Add DEFAULT when adding NOT NULL columns**
- **NEVER use PostgreSQL reserved keywords as column names** (see Reserved Keywords section)
- **NEVER add migration logging statements** - migrations are tracked automatically
- **NEVER use MySQL-style INDEX syntax inside CREATE TABLE** - use separate CREATE INDEX statements
- **NEVER use identical password hashes in seed data** - each user must have unique hashes
- **CRITICAL: Handle NULL constraints in seed data** - always provide required values or use CTEs with RETURNING
- **CRITICAL: Validate foreign key references** - ensure referenced records exist before inserting
- **CRITICAL: Use proper subqueries for foreign keys** - never assume external data exists
- **Name constraints explicitly** - helps with debugging and management

### Naming Conventions

- **Table names**: lowercase_with_underscores
- **Column names**: lowercase_with_underscores
- **Constraint names**: `{table}_{column}_{type}` (e.g., `users_email_unique`, `orders_user_id_fkey`)
- **Index names**: `idx_{table}_{column(s)}` (e.g., `idx_users_email`, `idx_orders_user_id_created_at`)

### Reserved Keywords to Avoid

Common PostgreSQL reserved keywords that CANNOT be used as column names:

- `constraint`, `check`, `default`, `primary`, `foreign`, `key`, `references`
- `select`, `insert`, `update`, `delete`, `create`, `drop`, `alter`
- `table`, `column`, `index`, `trigger`, `function`, `procedure`
- `entity`, `role`, `group`, `order`, `limit`, `offset`
- `where`, `having`, `union`, `join`, `on`, `as`
- `null`, `true`, `false`, `and`, `or`, `not`

**If you must use a reserved word, quote it**: `"constraint"`
**Better practice**: Use alternative names like `constraints`, `entity_role`, `sort_order`, `entities`, `orders`, `entity_groups`

### Status/Enum Patterns

**Option 1: CHECK Constraints (Simple)**

```sql
status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'))
```

**Option 2: PostgreSQL ENUM Types (Recommended for complex enums)**

```sql
-- Create enum type first
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'suspended');

-- Use in table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status user_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- To add new enum values later (cannot be rolled back easily)
-- Note: Cannot run inside a transaction block; place in its own migration
ALTER TYPE user_status ADD VALUE IF NOT EXISTS 'archived';
```

### Foreign Keys and Constraints

```sql
-- Entity-owned data (delete when entity deleted)
ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey
    FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

-- Reference data (prevent deletion if referenced)
ALTER TABLE products ADD CONSTRAINT products_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

-- Unique constraints
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Check constraints
ALTER TABLE products ADD CONSTRAINT products_price_positive CHECK (price > 0);
```

### Index Creation

**CRITICAL**: PostgreSQL does NOT support MySQL-style INDEX syntax inside CREATE TABLE statements.

**❌ WRONG (MySQL syntax - will fail):**

```sql
CREATE TABLE example (
    id UUID PRIMARY KEY,
    entity_id UUID,
    INDEX idx_entity_id (entity_id)  -- This will cause syntax error
);
```

**✅ CORRECT (PostgreSQL syntax):**

```sql
CREATE TABLE IF NOT EXISTS example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create foreign key constraint
ALTER TABLE example ADD CONSTRAINT example_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create indexes separately after table creation
CREATE INDEX IF NOT EXISTS idx_example_entity_id ON example (entity_id);
CREATE INDEX IF NOT EXISTS idx_example_created_at ON example (created_at);
CREATE INDEX IF NOT EXISTS idx_example_composite ON example (entity_id, created_at);

-- For large tables, use CONCURRENTLY to avoid blocking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_large_table_field ON large_table (field);
```

### Schema Evolution Patterns

**Adding NOT NULL columns to existing tables:**

```sql
-- Safe way to add NOT NULL column
ALTER TABLE existing_table ADD COLUMN new_column TEXT;
UPDATE existing_table SET new_column = 'default_value' WHERE new_column IS NULL;
ALTER TABLE existing_table ALTER COLUMN new_column SET NOT NULL;
```

**Renaming columns safely:**

```sql
ALTER TABLE users RENAME COLUMN old_name TO new_name;
```

**Dropping columns safely:**

```sql
ALTER TABLE users DROP COLUMN IF EXISTS deprecated_column;
```

**Modifying column types:**

```sql
-- Simple type changes
ALTER TABLE users ALTER COLUMN age TYPE INTEGER USING age::INTEGER;

-- Complex type changes may require intermediate steps
ALTER TABLE users ADD COLUMN age_new INTEGER;
UPDATE users SET age_new = age::INTEGER;
ALTER TABLE users DROP COLUMN age;
ALTER TABLE users RENAME COLUMN age_new TO age;
```

### UUID Generation and Seed Data

**CRITICAL**: Never hardcode UUIDs in migrations. Always let PostgreSQL generate them.

**❌ WRONG (Hardcoded UUIDs - causes conflicts and errors):**

```sql
-- These will conflict across environments and cause errors
INSERT INTO users (id, email, name) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'Admin'),
('0b349214-7fdc-41df-b47f-3a8a00b2eb96', 'user@example.com', 'User');

-- Also wrong - hardcoded UUID in related data
INSERT INTO communication_logs (id, customer_id, subject) VALUES
('12345678-1234-1234-1234-123456789012', '0b349214-7fdc-41df-b47f-3a8a00b2eb96', 'Issue');
```

**❌ ALSO WRONG (Assuming hardcoded UUIDs exist):**

```sql
-- This will fail if the hardcoded UUID doesn't exist
INSERT INTO communication_logs (customer_id, subject) VALUES
('0b349214-7fdc-41df-b47f-3a8a00b2eb96', 'Order Issue');
```

**❌ ALSO WRONG (Type casting errors in VALUES):**

```sql
-- This causes "operator does not exist: uuid = text" error
INSERT INTO products (id, name, score)
SELECT p.id, p.name, p.score
FROM (
    VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'iPhone 14', 0.92),  -- TEXT not UUID
    ('660e8400-e29b-41d4-a716-446655440004', 'MacBook', 0.89)
) AS p(id, name, score);
```

**✅ CORRECT (Let PostgreSQL generate UUIDs):**

```sql
-- ✅ BEST: Omit ID entirely (let table DEFAULT gen_random_uuid() handle it)
INSERT INTO users (email, name) VALUES
('admin@example.com', 'Admin'),
('user@example.com', 'User');

-- ✅ ALSO GOOD: Use gen_random_uuid() explicitly (but unnecessary if table has DEFAULT)
INSERT INTO users (id, email, name) VALUES
(gen_random_uuid(), 'admin@example.com', 'Admin'),
(gen_random_uuid(), 'user@example.com', 'User');
```

**For related data, use CTEs with RETURNING:**

```sql
WITH inserted_databases AS (
  INSERT INTO databases (name) VALUES ('primary_db'), ('analytics_db')
  RETURNING id, name
)
INSERT INTO tables (database_id, name)
SELECT d.id, t.table_name
FROM inserted_databases d
CROSS JOIN (VALUES ('users'), ('orders')) AS t(table_name)
WHERE d.name = 'primary_db';
```

### Foreign Key References in Seed Data

**CRITICAL**: When inserting seed data with foreign keys, NEVER assume referenced records exist. Always use proper subqueries or CTEs.

**❌ WRONG (Assumes external data exists):**

```sql
-- This will FAIL if user with this email doesn't exist
INSERT INTO communication_logs (customer_id, subject, status) VALUES
((SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1), 'Order Issue', 'open');
```

**❌ ALSO WRONG (NULL constraint violation):**

```sql
-- This creates NULL customer_id if user doesn't exist
INSERT INTO communication_logs (customer_id, subject, status) VALUES
((SELECT id FROM users WHERE email = 'nonexistent@example.com' LIMIT 1), 'Order Issue', 'open');
```

**✅ CORRECT (Create dependencies first):**

```sql
-- Option 1: Create all related data in one transaction with CTEs
WITH inserted_users AS (
  INSERT INTO users (email, name) VALUES ('test@example.com', 'Test User')
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  RETURNING id, email
)
INSERT INTO communication_logs (customer_id, subject, status)
SELECT u.id, 'Order Delivery Issue', 'open'
FROM inserted_users u
WHERE u.email = 'test@example.com';

-- Option 2: Use UPSERT pattern to ensure user exists
INSERT INTO users (email, name) VALUES ('test@example.com', 'Test User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO communication_logs (customer_id, subject, status)
SELECT u.id, 'Order Delivery Issue', 'open'
FROM users u
WHERE u.email = 'test@example.com';
```

**✅ ALSO CORRECT (Validate existence with conditions):**

```sql
-- Only insert if the foreign key reference exists
INSERT INTO communication_logs (customer_id, subject, status)
SELECT u.id, 'Order Delivery Issue', 'open'
FROM users u
WHERE u.email = 'test@example.com'
  AND u.id IS NOT NULL;  -- Explicit null check for safety
```

**✅ CORRECT (Using DO blocks for validation):**

```sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com') THEN
        INSERT INTO users (email, name, role) VALUES ('admin@example.com', 'Admin', 'admin');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Electronics') THEN
        INSERT INTO categories (name, description) VALUES ('Electronics', 'Electronic devices');
    END IF;
END $$;
```

### NULL Constraint Prevention

**CRITICAL**: Always ensure NOT NULL columns have valid values in seed data.

**❌ WRONG (Can cause NULL constraint violations):**

```sql
-- If subquery returns NULL, this violates NOT NULL constraint
INSERT INTO orders (customer_id, status) VALUES
((SELECT id FROM users WHERE email = 'missing@example.com'), 'pending');
```

**✅ CORRECT (Explicit validation):**

```sql
-- Use WHERE clause to prevent inserting if required data is missing
INSERT INTO orders (customer_id, status)
SELECT u.id, 'pending'
FROM users u
WHERE u.email = 'test@example.com'
  AND u.id IS NOT NULL;

-- Or use COALESCE with a meaningful default/error
-- (Only if business logic allows defaults)
INSERT INTO orders (customer_id, status) VALUES
(COALESCE(
  (SELECT id FROM users WHERE email = 'test@example.com'),
  gen_random_uuid()  -- Only if this makes business sense
), 'pending');
```

### Security in Seed Data

**CRITICAL**: Never use identical password hashes for multiple users, even in test data.

**❌ WRONG (Security vulnerability):**

```sql
-- Same hash for all users - major security flaw!
INSERT INTO users (email, password_hash) VALUES
('admin@example.com', '$2b$10$SAME_HASH_FOR_EVERYONE'),
('user@example.com', '$2b$10$SAME_HASH_FOR_EVERYONE');
```

**✅ CORRECT (Unique hashes):**

```sql
-- Each user gets a unique hash, even for the same password
INSERT INTO users (email, password_hash) VALUES
('admin@example.com', '$2b$10$PFsdWm4hEoElnbFh51a8SOJASy3FpZBcAfX5psbPe0KgAu3BPIT5q'),
('user@example.com', '$2b$10$XJECr30qju4Zmrl7oQDvmOTwtwwFk3K6huHflbsoBc89.FHuiaNjO');
```

### Common Error Patterns and Prevention

**Error 1: "null value in column X violates not-null constraint"**

**Cause**: Subquery in INSERT returns NULL because referenced record doesn't exist.

**Fix**: Always validate foreign key existence before inserting:

```sql
-- ❌ BAD: Can create NULL values
INSERT INTO communication_logs (customer_id, subject) VALUES
((SELECT id FROM users WHERE email = 'missing@example.com'), 'Subject');

-- ✅ GOOD: Only insert if foreign key exists
INSERT INTO communication_logs (customer_id, subject)
SELECT u.id, 'Subject'
FROM users u
WHERE u.email = 'test@example.com';
```

**Error 2: "syntax error at or near 'INDEX'"**

**Cause**: Using MySQL INDEX syntax inside PostgreSQL CREATE TABLE.

**Fix**: Create indexes separately after table creation.

**Error 3: "relation X does not exist"**

**Cause**: Referencing tables that haven't been created yet, or typos in table names.

**Fix**: Ensure proper migration order and check table names.

**Error 4: Hardcoded UUIDs causing conflicts**

**Cause**: Using same UUID values across environments or duplicate inserts.

**Fix**: Always use `gen_random_uuid()` or omit ID entirely.

**Error 5: "operator does not exist: uuid = text"**

**Cause**: Using hardcoded UUID strings in VALUES clauses - PostgreSQL treats string literals as TEXT, not UUID.

**Fix**: NEVER use hardcoded UUIDs. Always reference actual data from existing tables.

**Error 6: "constraint X already exists"**

**Cause**: Not using IF NOT EXISTS or trying to add the same constraint twice.

**Fix**: Always use IF NOT EXISTS for constraints, or DROP IF EXISTS first.

**Error 7: Case sensitivity issues**

**Cause**: PostgreSQL folds unquoted identifiers to lowercase, but quoted ones are case-sensitive.

**Fix**: Be consistent with identifier casing - use lowercase_with_underscores.

```sql
-- ❌ BAD: Mixed cases can cause issues
CREATE TABLE MyTable ("UserId" UUID, user_email TEXT);

-- ✅ GOOD: Consistent lowercase
CREATE TABLE my_table (user_id UUID, user_email TEXT);
```

**Error 8: String escaping in SQL**

**Cause**: Special characters in string literals not properly escaped.

**Fix**: Use proper escaping or dollar quoting:

```sql
-- ✅ CORRECT: Dollar quoting for complex strings
INSERT INTO products (name, description) VALUES
('Product Name', $$Description with 'quotes' and "other quotes"$$);

-- ✅ ALSO CORRECT: Proper escaping
INSERT INTO products (name, description) VALUES
('Product Name', 'Description with ''quotes''');
```

### Seed Data Best Practices

**GOLDEN RULE: Always reference actual data, never hardcode UUIDs**

**Pattern 1: Reference existing data by name/email/unique fields:**

```sql
-- ✅ CORRECT: Reference by natural keys (email, name, etc.)
INSERT INTO recommendations (customer_id, product_id, score)
SELECT
    c.id as customer_id,
    p.id as product_id,
    CASE
        WHEN p.name = 'iPhone 14' THEN 0.92
        WHEN p.name = 'MacBook Pro 14"' THEN 0.89
        ELSE 0.75
    END as score
FROM customers c
CROSS JOIN products p
WHERE c.email = 'test@example.com'
  AND p.name IN ('iPhone 14', 'MacBook Pro 14"');
```

**Pattern 2: Create dependencies first, then reference them:**

```sql
-- ✅ CORRECT: Dependencies before dependents
-- 1. Create users first
INSERT INTO users (email, name) VALUES ('test@example.com', 'Test User')
ON CONFLICT (email) DO NOTHING;

-- 2. Create dependent records using proper joins
INSERT INTO communication_logs (customer_id, subject, status)
SELECT u.id, 'Order Delivery Issue', 'resolved'
FROM users u
WHERE u.email = 'test@example.com';
```

**Pattern 3: Use CTEs for complex dependencies:**

```sql
-- ✅ CORRECT: Use CTE to create and reference in one transaction
WITH created_user AS (
  INSERT INTO users (email, name) VALUES ('test@example.com', 'Test User')
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  RETURNING id
),
created_products AS (
  INSERT INTO products (name, category, price) VALUES
    ('iPhone 14', 'Electronics', 999.00),
    ('MacBook Pro 14"', 'Electronics', 1999.00)
  ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price
  RETURNING id, name
)
INSERT INTO recommendations (customer_id, product_id, score)
SELECT
  u.id,
  p.id,
  CASE
    WHEN p.name = 'iPhone 14' THEN 0.92
    WHEN p.name = 'MacBook Pro 14"' THEN 0.89
  END
FROM created_user u
CROSS JOIN created_products p;
```

### Advanced Patterns

**Working with JSONB:**

```sql
-- Create table with JSONB column
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferences JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create GIN index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_user_preferences_jsonb ON user_preferences USING GIN (preferences);

-- Insert JSONB data
INSERT INTO user_preferences (user_id, preferences)
SELECT u.id, '{"theme": "dark", "notifications": true, "language": "en"}'::JSONB
FROM users u
WHERE u.email = 'test@example.com';
```

**Working with Arrays:**

```sql
-- Create table with array column
CREATE TABLE IF NOT EXISTS user_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

-- Create GIN index for array queries
CREATE INDEX IF NOT EXISTS idx_user_tags_array ON user_tags USING GIN (tags);

-- Insert array data
INSERT INTO user_tags (user_id, tags)
SELECT u.id, ARRAY['premium', 'active', 'verified']
FROM users u
WHERE u.email = 'test@example.com';
```

**Date/Time Handling:**

```sql
-- Always use TIMESTAMPTZ for timezone-aware timestamps
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Use proper timezone functions
INSERT INTO events (name, event_date) VALUES
('Meeting', NOW() + INTERVAL '1 day'),
('Deadline', '2024-12-31 23:59:59+00'::TIMESTAMPTZ);
```

### Data Separation and Migration Organization

- **NEVER mix DDL with sample data in same migration**
- **Separate migrations**: `001-create-tables.sql`, `002-add-indexes.sql`, `003-sample-data.sql`
- **Sample data should be optional and recoverable**
- **Use descriptive migration names**: `001-create-user-tables.sql`, not `001-migration.sql`
- **Group related changes**: All tables for a feature in one migration

### Migration Rollback Strategies

While the rule is "never modify existing migrations," you need rollback strategies:

**Strategy 1: Create reverse migration**

```sql
-- Original: 003-add-user-preferences.sql
CREATE TABLE user_preferences (...);

-- Rollback: 004-remove-user-preferences.sql
DROP TABLE IF EXISTS user_preferences;
```

**Strategy 2: Use IF EXISTS for safe operations**

```sql
-- This migration can be run multiple times safely
ALTER TABLE users ADD COLUMN IF NOT EXISTS middle_name TEXT;
CREATE INDEX IF NOT EXISTS idx_users_middle_name ON users (middle_name);
```

**Strategy 3: Feature flags in data**

```sql
-- Instead of dropping features, disable them
UPDATE feature_flags SET enabled = false WHERE feature_name = 'new_dashboard';
```

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

### Performance Considerations

**For Large Data Operations:**

```sql
-- Create table first
CREATE TABLE large_table (...);

-- Insert data (indexes can slow this down)
INSERT INTO large_table (...) VALUES (...);

-- Create indexes after data insertion
CREATE INDEX CONCURRENTLY idx_large_table_field ON large_table (field);

-- CONCURRENTLY allows reads/writes during index creation but:
-- - Cannot be used inside transactions
-- - Takes longer than regular CREATE INDEX
-- - Use for production, skip for development
```

**Batch Operations:**

```sql
-- For large datasets, use batch inserts
INSERT INTO large_table (col1, col2, col3)
SELECT * FROM (
    VALUES
    ('val1', 'val2', 'val3'),
    ('val4', 'val5', 'val6')
    -- ... up to 1000 rows per batch
) AS v(col1, col2, col3);
```

## Usage

- Migrations run automatically on app startup
- Add SQL file to `migrations/` directory with descriptive name
- Add Drizzle schema to `schema.ts`
- Use in application code
- Test migrations on copy of production data before deploying
