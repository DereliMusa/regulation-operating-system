import { z } from 'zod'
import { getAuditLogView } from '../../utils/auditLog'
import { db } from '../../utils/db'
import type { AuditLogView } from '#shared/types/audit-log'

const querySchema = z.object({
  actorType: z.enum(['user', 'ai', 'system']).optional(),
  impact: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  search: z.string().max(200).optional(),
})

export default defineEventHandler((event): AuditLogView => {
  const query = querySchema.parse(getQuery(event))
  return getAuditLogView(db, query)
})
