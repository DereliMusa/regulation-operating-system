import { z } from 'zod'
import { createRisk } from '../../utils/risk'
import { db } from '../../utils/db'
import type { RiskEntry } from '#shared/types/risk'

const createSchema = z.object({
  technicalFileId: z.number().int().positive(),
  riskId: z.string().min(1, 'Risk id is required').max(100),
  hazardDescription: z.string().min(1, 'Hazard description is required').max(1000),
  severity: z.enum(['critical', 'major', 'moderate', 'minor']),
  probability: z.string().max(100).nullish(),
  status: z.enum(['draft', 'review', 'mitigated']).optional(),
  mitigation: z.string().max(2000).nullish(),
  controlMeasureRef: z.string().max(100).nullish(),
  verificationRef: z.string().max(100).nullish(),
  traceabilityRefs: z.array(z.string().max(100)).max(50).optional(),
})

export default defineEventHandler(async (event): Promise<RiskEntry> => {
  const body = await readValidatedBody(event, createSchema.parse)
  return createRisk(db, body)
})
