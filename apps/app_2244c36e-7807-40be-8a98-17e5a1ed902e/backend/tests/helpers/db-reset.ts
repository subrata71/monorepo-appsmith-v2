// tests/helpers/db-reset.ts
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator'; // ← JS API:contentReference[oaicite:0]{index=0}

/** Hard‑reset the `public` schema and re‑apply all migrations.
 * Call once per test file (e.g. in `beforeAll`).
 */
export async function resetDb(app: { db: any }) {
  // 1️⃣ Drop *everything* in public and recreate it
  await app.db.execute(
    sql.raw(`
    DROP SCHEMA IF EXISTS public CASCADE;
    CREATE SCHEMA public;
  `)
  );

  // 2️⃣ Re‑run Drizzle migrations programmatically
  //    Looks for `.sql` files in the default `drizzle/` folder
  await migrate(app.db, { migrationsFolder: 'drizzle' });
}
