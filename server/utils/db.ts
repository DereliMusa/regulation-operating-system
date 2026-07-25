// The app's Drizzle instance. Kept separate from createDb.ts's pure
// factory so importing the factory (e.g. from tests) never triggers this
// module-level side effect of opening the real database file.
import { createDb } from './createDb'

const dbPath = process.env.DATABASE_PATH || './.data/certra.db'
export const db = createDb(dbPath)
