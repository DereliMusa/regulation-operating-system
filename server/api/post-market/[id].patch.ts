import { z } from 'zod'
import { updatePmsPlan } from '../../utils/postMarket'
import { writeAuditLog } from '../../utils/auditLog'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'
import type { PmsPlan } from '#shared/types/post-market'

const patchSchema = z.object({
  planType: z.enum(['PMS', 'PMCF', 'PSUR']).optional(),
  nextDue: z.string().min(1).max(40).optional(),
  deviceRef: z.string().max(200).nullish(),
  status: z.enum(['pending_review', 'active', 'drafting', 'deficiency']).optional(),
  confidence: z.number().int().min(0).max(100).nullish(),
})

export default defineEventHandler(async (event): Promise<PmsPlan> => {
  const { user } = await requireUserSession(event)
  const id = getIdParam(event)
  const body = await readValidatedBody(event, patchSchema.parse)
  const plan = updatePmsPlan(db, id, body)
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Updated post-market plan',
    impact: 'medium', entityType: 'pms_plans', entityRef: plan.planType,
  })
  return plan
})
