import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from '../database/schema'

export type Db = ReturnType<typeof drizzle<typeof schema>>

// NOTE: server/database/migrations must ship alongside the built output in
// production (see SDLC/01-architecture/deployment.md); the S9 Dockerfile
// step is responsible for copying it into the image.
const MIGRATIONS_DIR = fileURLToPath(new URL('../database/migrations', import.meta.url))

/**
 * Create a Drizzle/SQLite database instance at the given file path, or an
 * in-memory database when path is ':memory:' (used by tests). Applies any
 * pending migrations before returning, so callers always see the current
 * schema.
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

const dbPath = process.env.DATABASE_PATH || './.data/certra.db'
export const db = createDb(dbPath)
