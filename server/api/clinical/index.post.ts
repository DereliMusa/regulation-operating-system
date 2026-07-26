import { z } from 'zod'
import { createClinicalEvidence } from '../../utils/clinical'
import { writeAuditLog } from '../../utils/auditLog'
import { db } from '../../utils/db'
import type { ClinicalEvidence } from '#shared/types/clinical'

const createSchema = z.object({
  technicalFileId: z.number().int().positive(),
  cerRef: z.string().min(1, 'CER ref is required').max(100),
  sourceType: z.enum(['literature', 'investigation', 'pms']),
  title: z.string().min(1, 'Title is required').max(300),
  status: z.enum(['approved', 'in_review', 'draft', 'deficiency']).optional(),
  aiSummary: z.string().max(2000).nullish(),
  confidence: z.number().int().min(0).max(100).nullish(),
})

export default defineEventHandler(async (event): Promise<ClinicalEvidence> => {
  const { user } = await requireUserSession(event)
  const body = await readValidatedBody(event, createSchema.parse)
  const entry = createClinicalEvidence(db, body)
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Added clinical evidence',
    impact: 'medium', entityType: 'clinical_evidence', entityRef: entry.cerRef,
  })
  return entry
})
