import { defineConfig } from 'drizzle-kit'

// Drizzle Kit config: generates SQL migrations from server/database/schema.ts.
// dbCredentials.url must match server/utils/db.ts's default DATABASE_PATH.
export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH || './.data/certra.db',
  },
})
