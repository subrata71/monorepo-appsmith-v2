import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { DatabaseConnection, type DrizzleDB } from '../db/connection.js';

interface SeedLogEntry {
  id: number;
  name: string;
  completed_at: Date;
}

export class SeedRunner {
  private db: DrizzleDB;
  private connection: DatabaseConnection;

  constructor() {
    this.connection = DatabaseConnection.getInstance();
    this.db = this.connection.getDb();
  }

  private getSeedFiles(): Array<{ name: string; path: string }> {
    const seedsDir = join(process.cwd(), 'src', 'seeds', 'sql_files');

    try {
      const files = readdirSync(seedsDir)
        .filter(file => file.endsWith('.sql') && /^\d+/.test(file)) // Only numbered .sql files
        .filter(
          file =>
            !file.includes('__entity__') && !file.includes('__entityPlural__')
        ) // Skip template files with placeholders
        .sort(); // Sort to ensure proper order

      return files.map(file => ({
        name: file,
        path: join(seedsDir, file),
      }));
    } catch (error) {
      console.warn(`Seeds SQL files directory not found: ${seedsDir}`, error);
      return [];
    }
  }

  private async getCompletedSeeds(): Promise<Set<string>> {
    try {
      const result = await this.connection
        .getPool()
        .query<SeedLogEntry>('SELECT name FROM seed_log');
      return new Set(result.rows.map((row: SeedLogEntry) => row.name));
    } catch (error) {
      console.warn('Could not fetch completed seeds:', error);
      return new Set();
    }
  }

  private async logSeed(name: string) {
    await this.connection
      .getPool()
      .query('INSERT INTO seed_log (name) VALUES ($1)', [name]);
  }

  async runSeeds() {
    console.log('🌱 Running database seeds...');

    const seedFiles = this.getSeedFiles();
    const completedSeeds = await this.getCompletedSeeds();

    if (seedFiles.length === 0) {
      console.log('📝 No seed files found');
      return;
    }

    for (const { name, path } of seedFiles) {
      if (completedSeeds.has(name)) {
        console.log(`⏭️  Skipping seed ${name}: already applied`);
        continue;
      }

      console.log(`🔧 Running seed ${name}`);

      try {
        const sqlContent = readFileSync(path, 'utf-8');

        // Execute the seed in a transaction
        const client = await this.connection.getPool().connect();

        try {
          await client.query('BEGIN');
          await client.query(sqlContent);
          await this.logSeed(name);
          await client.query('COMMIT');

          console.log(`✅ Successfully applied seed ${name}`);
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error(`❌ Error running seed ${name}:`, error);
        throw error;
      }
    }

    console.log('✅ All seeds completed successfully!');
  }

  async close() {
    await this.connection.close();
  }
}

// Export a function to run seeds
export async function runSeeds() {
  const runner = new SeedRunner();
  try {
    await runner.runSeeds();
  } finally {
    await runner.close();
  }
}
