import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export type DrizzleDB = ReturnType<typeof drizzle>;

export class DatabaseConnection {
  private static instance: DatabaseConnection | null;
  private pool: Pool;
  private db: DrizzleDB;

  private constructor(databaseUrl: string) {
    this.pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle(this.pool);
  }

  static getInstance(): DatabaseConnection {
    const databaseUrl = process.env.APP_DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('APP_DATABASE_URL environment variable is required');
    }

    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(databaseUrl);
    }
    return DatabaseConnection.instance;
  }

  getDb(): DrizzleDB {
    return this.db;
  }

  getPool(): Pool {
    return this.pool;
  }

  async close() {
    await this.pool.end();
    DatabaseConnection.instance = null;
  }
}

// Convenience function to get database instance
export function getDatabase(): DrizzleDB {
  return DatabaseConnection.getInstance().getDb();
}

// Convenience function to get pool instance
export function getPool(): Pool {
  return DatabaseConnection.getInstance().getPool();
}
