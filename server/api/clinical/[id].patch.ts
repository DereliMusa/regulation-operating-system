import { z } from 'zod'
import { updateClinicalEvidence } from '../../utils/clinical'
import { writeAuditLog } from '../../utils/auditLog'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'
import type { ClinicalEvidence } from '#shared/types/clinical'

const patchSchema = z.object({
  cerRef: z.string().min(1).max(100).optional(),
  sourceType: z.enum(['literature', 'investigation', 'pms']).optional(),
  title: z.string().min(1).max(300).optional(),
  status: z.enum(['approved', 'in_review', 'draft', 'deficiency']).optional(),
  aiSummary: z.string().max(2000).nullish(),
  confidence: z.number().int().min(0).max(100).nullish(),
})

export default defineEventHandler(async (event): Promise<ClinicalEvidence> => {
  const { user } = await requireUserSession(event)
  const id = getIdParam(event)
  const body = await readValidatedBody(event, patchSchema.parse)
  const entry = updateClinicalEvidence(db, id, body)
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Updated clinical evidence',
    impact: 'medium', entityType: 'clinical_evidence', entityRef: entry.cerRef,
  })
  return entry
})
