import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { DatabaseConnection, type DrizzleDB } from './connection';
import { getEnvironment } from '../utils/env';

interface MigrationLogEntry {
  id: number;
  name: string;
  sql_content: string;
  completed_at: Date;
}

export class MigrationRunner {
  private db: DrizzleDB;
  private connection: DatabaseConnection;

  constructor() {
    this.connection = DatabaseConnection.getInstance();
    this.db = this.connection.getDb();
  }

  private getMigrationFiles(): Array<{ name: string; path: string }> {
    const migrationsDir = join(process.cwd(), 'src', 'db', 'migrations');

    try {
      const files: string[] = readdirSync(migrationsDir)
        .filter((file: string) => file.endsWith('.sql'))
        .sort(); // Sort to ensure proper order

      return files.map((file: string) => ({
        name: file,
        path: join(migrationsDir, file),
      }));
    } catch (error) {
      console.warn(`Migrations directory not found: ${migrationsDir}`, error);
      return [];
    }
  }

  private async getCompletedMigrations(): Promise<Set<string>> {
    try {
      const result = await this.connection
        .getPool()
        .query<MigrationLogEntry>('SELECT name FROM migration_log');
      return new Set(result.rows.map((row: MigrationLogEntry) => row.name));
    } catch (error) {
      // If migration_log table doesn't exist yet, that's expected for the first run
      console.log(
        '📝 First run detected - migration_log table will be created',
        error
      );
      return new Set();
    }
  }

  private shouldSkipMigration(
    migrationName: string,
    environment: string
  ): boolean {
    // Skip template files only in production environment
    if (migrationName.includes('__entityPlural__')) {
      return environment === 'production';
    }
    return false;
  }

  private async logMigration(name: string, sqlContent: string) {
    await this.connection
      .getPool()
      .query('INSERT INTO migration_log (name, sql_content) VALUES ($1, $2)', [
        name,
        sqlContent,
      ]);
  }

  private isNonTransactional(sqlContent: string): boolean {
    const header = sqlContent.split(/\r?\n/, 5).join('\n');
    const hasNoTxDirective =
      /(^|\n)\s*--\s*NO_TRANSACTION\b/i.test(header) ||
      /(^|\n)\s*\/\*\s*NO_TRANSACTION\s*\*\//i.test(header);

    // Heuristic detection of statements that cannot run inside a transaction block
    const hasConcurrentIndex =
      /CREATE\s+INDEX\s+CONCURRENTLY|DROP\s+INDEX\s+CONCURRENTLY|REINDEX\s+CONCURRENTLY|REFRESH\s+MATERIALIZED\s+VIEW\s+CONCURRENTLY/i.test(
        sqlContent
      );
    const hasAlterTypeAddValue = /ALTER\s+TYPE[\s\S]+ADD\s+VALUE/i.test(
      sqlContent
    );
    const hasVacuum = /\bVACUUM\b/i.test(sqlContent);
    const hasCluster = /\bCLUSTER\b/i.test(sqlContent);
    const hasCreateDatabase = /\bCREATE\s+DATABASE\b/i.test(sqlContent);
    const hasAlterSystem = /\bALTER\s+SYSTEM\b/i.test(sqlContent);

    const matchesHeuristic =
      hasConcurrentIndex ||
      hasAlterTypeAddValue ||
      hasVacuum ||
      hasCluster ||
      hasCreateDatabase ||
      hasAlterSystem;

    return hasNoTxDirective || matchesHeuristic;
  }

  async runMigrations() {
    console.log('🗄️  Running custom database migrations...');

    const migrationFiles = this.getMigrationFiles();
    const completedMigrations = await this.getCompletedMigrations();
    const nodeEnv = getEnvironment();

    if (migrationFiles.length === 0) {
      console.log('📝 No migration files found');
      return;
    }

    for (const { name, path } of migrationFiles) {
      if (completedMigrations.has(name)) {
        console.log(`⏭️  Skipping migration ${name}: already applied`);
        continue;
      }

      // Check if this migration should run in the current environment
      if (this.shouldSkipMigration(name, nodeEnv)) {
        console.log(
          `⏭️  Skipping migration ${name}: not applicable for ${nodeEnv} environment`
        );
        continue;
      }

      console.log(`🔧 Applying migration ${name}`);

      try {
        const sqlContent = readFileSync(path, 'utf-8');

        const client = await this.connection.getPool().connect();
        const nonTransactional = this.isNonTransactional(sqlContent);

        try {
          if (nonTransactional) {
            console.log(
              '⚠️  Executing without transaction (detected NO_TRANSACTION or non-transactional statements)'
            );
            await client.query(sqlContent);

            if (name !== '001-migration-log.sql') {
              await this.logMigration(name, sqlContent);
            } else {
              console.log(
                `📝 Skipping log for ${name} (creates migration_log table)`
              );
            }
          } else {
            await client.query('BEGIN');
            await client.query(sqlContent);

            // Skip logging for the first migration (which creates the migration_log table)
            if (name !== '001-migration-log.sql') {
              await this.logMigration(name, sqlContent);
            } else {
              console.log(
                `📝 Skipping log for ${name} (creates migration_log table)`
              );
            }

            await client.query('COMMIT');
          }

          console.log(`✅ Successfully applied migration ${name}`);
        } catch (error) {
          // Rollback only if we opened an explicit transaction
          if (!nonTransactional) {
            await client.query('ROLLBACK');
          }
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
    await this.connection.close();
  }
}

// Export a function to run migrations
export async function runMigrations() {
  const runner = new MigrationRunner();
  try {
    await runner.runMigrations();
  } finally {
    await runner.close();
  }
}
