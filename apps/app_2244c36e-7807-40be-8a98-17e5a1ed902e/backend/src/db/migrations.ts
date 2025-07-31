import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

interface MigrationLogEntry {
  id: number;
  name: string;
  sql_content: string;
  completed_at: Date;
}

export class MigrationRunner {
  private db: ReturnType<typeof drizzle>;
  private pool: Pool;

  constructor(databaseUrl: string) {
    this.pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle(this.pool);
  }

  async initialize() {
    // Create migration_log table if it doesn't exist
    await this.createMigrationLogTable();
  }

  private async createMigrationLogTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS migration_log (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        sql_content TEXT NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.pool.query(createTableSQL);
  }

  private getMigrationFiles(): Array<{ name: string; path: string }> {
    const migrationsDir = join(process.cwd(), 'src', 'db', 'migrations');

    try {
      const files = readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Sort to ensure proper order

      return files.map(file => ({
        name: file,
        path: join(migrationsDir, file),
      }));
    } catch (error) {
      console.warn(`Migrations directory not found: ${migrationsDir}`);
      return [];
    }
  }

  private async getCompletedMigrations(): Promise<Set<string>> {
    try {
      const result = await this.pool.query<MigrationLogEntry>(
        'SELECT name FROM migration_log'
      );
      return new Set(result.rows.map(row => row.name));
    } catch (error) {
      console.warn('Could not fetch completed migrations:', error);
      return new Set();
    }
  }

  private async logMigration(name: string, sqlContent: string) {
    await this.pool.query(
      'INSERT INTO migration_log (name, sql_content) VALUES ($1, $2)',
      [name, sqlContent]
    );
  }

  async runMigrations() {
    console.log('🗄️  Running custom database migrations...');

    await this.initialize();

    const migrationFiles = this.getMigrationFiles();
    const completedMigrations = await this.getCompletedMigrations();

    if (migrationFiles.length === 0) {
      console.log('📝 No migration files found');
      return;
    }

    for (const { name, path } of migrationFiles) {
      if (completedMigrations.has(name)) {
        console.log(`⏭️  Skipping migration ${name}: already applied`);
        continue;
      }

      console.log(`🔧 Applying migration ${name}`);

      try {
        const sqlContent = readFileSync(path, 'utf-8');

        // Execute the migration in a transaction
        const client = await this.pool.connect();

        try {
          await client.query('BEGIN');
          await client.query(sqlContent);
          await this.logMigration(name, sqlContent);
          await client.query('COMMIT');

          console.log(`✅ Successfully applied migration ${name}`);
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error(`❌ Error applying migration ${name}:`, error);
        throw error;
      }
    }

    console.log('✅ All migrations completed successfully!');
  }

  async close() {
    await this.pool.end();
  }
}

// Export a function to run migrations
export async function runMigrations(databaseUrl: string) {
  const runner = new MigrationRunner(databaseUrl);
  try {
    await runner.runMigrations();
  } finally {
    await runner.close();
  }
}
