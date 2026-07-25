import { getDashboardStats } from '../../utils/dashboard'
import { db } from '../../utils/db'
import type { DashboardStats } from '#shared/types/dashboard'

// Auth is enforced by server/middleware/auth.ts, which protects /api/* by
// default, so this route needs no explicit session check.
export default defineEventHandler((): DashboardStats => {
  return getDashboardStats(db)
})
