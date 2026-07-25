import { z } from 'zod'
import { updateRisk } from '../../utils/risk'
import { writeAuditLog } from '../../utils/auditLog'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'
import type { RiskEntry } from '#shared/types/risk'

const patchSchema = z.object({
  riskId: z.string().min(1).max(100).optional(),
  hazardDescription: z.string().min(1).max(1000).optional(),
  severity: z.enum(['critical', 'major', 'moderate', 'minor']).optional(),
  probability: z.string().max(100).nullish(),
  status: z.enum(['draft', 'review', 'mitigated']).optional(),
  mitigation: z.string().max(2000).nullish(),
  controlMeasureRef: z.string().max(100).nullish(),
  verificationRef: z.string().max(100).nullish(),
  traceabilityRefs: z.array(z.string().max(100)).max(50).optional(),
})

export default defineEventHandler(async (event): Promise<RiskEntry> => {
  const { user } = await requireUserSession(event)
  const id = getIdParam(event)
  const body = await readValidatedBody(event, patchSchema.parse)
  const entry = updateRisk(db, id, body)
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Updated risk entry',
    impact: 'medium', entityType: 'risk_entries', entityRef: entry.riskId,
  })
  return entry
})
