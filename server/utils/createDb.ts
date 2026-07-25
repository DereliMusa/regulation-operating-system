import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from '../database/schema'

export type Db = ReturnType<typeof drizzle<typeof schema>>

// Resolved relative to the process working directory (project root in dev;
// the Docker WORKDIR in production) rather than import.meta.url, since
// Nitro's dev bundler does not preserve the real source file location.
// NOTE: server/database/migrations must ship alongside the built output in
// production (see SDLC/01-architecture/deployment.md); the S9 Dockerfile
// step is responsible for copying it into the image at the same relative path.
const MIGRATIONS_DIR = resolve(process.cwd(), 'server/database/migrations')

/**
 * Create a Drizzle/SQLite database instance at the given file path, or an
 * in-memory database when path is ':memory:' (used by tests). Applies any
 * pending migrations before returning, so callers always see the current
 * schema. Pure factory, no module-level side effects — safe to import from
 * tests without touching the real app database file.
 */
export function createDb(path: string): Db {
  const isFile = path !== ':memory:'
  if (isFile) {
    const dir = dirname(path)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  }

  const sqlite = new Database(path)
  if (isFile) sqlite.pragma('journal_mode = WAL')

  const db = drizzle(sqlite, { schema })
  migrate(db, { migrationsFolder: MIGRATIONS_DIR })
  return db
}
