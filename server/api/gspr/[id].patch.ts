import { z } from 'zod'
import { updateGspr } from '../../utils/gspr'
import { writeAuditLog } from '../../utils/auditLog'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'
import type { GsprEntry } from '#shared/types/gspr'

const patchSchema = z.object({
  gsprRef: z.string().min(1).max(100).optional(),
  requirementText: z.string().min(1).max(1000).optional(),
  conformity: z.enum(['conforming', 'partial', 'missing']).optional(),
  evidenceRefs: z.array(z.string().max(100)).max(50).optional(),
  standardRefs: z.array(z.string().max(100)).max(50).optional(),
  notes: z.string().max(2000).nullish(),
})

export default defineEventHandler(async (event): Promise<GsprEntry> => {
  const { user } = await requireUserSession(event)
  const id = getIdParam(event)
  const body = await readValidatedBody(event, patchSchema.parse)
  const entry = updateGspr(db, id, body)
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Updated GSPR entry',
    impact: 'medium', entityType: 'gspr_entries', entityRef: entry.gsprRef,
  })
  return entry
})
