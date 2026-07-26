import { z } from 'zod'
import { createGspr } from '../../utils/gspr'
import { writeAuditLog } from '../../utils/auditLog'
import { db } from '../../utils/db'
import type { GsprEntry } from '#shared/types/gspr'

const createSchema = z.object({
  technicalFileId: z.number().int().positive(),
  gsprRef: z.string().min(1, 'GSPR reference is required').max(100),
  requirementText: z.string().min(1, 'Requirement text is required').max(1000),
  conformity: z.enum(['conforming', 'partial', 'missing']),
  evidenceRefs: z.array(z.string().max(100)).max(50).optional(),
  standardRefs: z.array(z.string().max(100)).max(50).optional(),
  notes: z.string().max(2000).nullish(),
})

export default defineEventHandler(async (event): Promise<GsprEntry> => {
  const { user } = await requireUserSession(event)
  const body = await readValidatedBody(event, createSchema.parse)
  const entry = createGspr(db, body)
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Added GSPR entry',
    impact: 'medium', entityType: 'gspr_entries', entityRef: entry.gsprRef,
  })
  return entry
})
