import { z } from 'zod'
import { createGspr } from '../../utils/gspr'
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
  const body = await readValidatedBody(event, createSchema.parse)
  return createGspr(db, body)
})
