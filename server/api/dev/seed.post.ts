import { db } from '../../utils/db'
import { seedDatabase } from '../../database/seed'

/**
 * Development-only endpoint that (re)populates the database with demo
 * data. Disabled outside development so it can never touch real data.
 * `hashPassword` is auto-imported from nuxt-auth-utils.
 */
export default defineEventHandler(async () => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  await seedDatabase(db, { hashPassword })
  return { seeded: true }
})
