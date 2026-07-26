import { z } from 'zod'
import { createPmsPlan } from '../../utils/postMarket'
import { writeAuditLog } from '../../utils/auditLog'
import { db } from '../../utils/db'
import type { PmsPlan } from '#shared/types/post-market'

const createSchema = z.object({
  technicalFileId: z.number().int().positive(),
  planType: z.enum(['PMS', 'PMCF', 'PSUR']),
  nextDue: z.string().min(1, 'Next due date is required').max(40),
  deviceRef: z.string().max(200).nullish(),
  status: z.enum(['pending_review', 'active', 'drafting', 'deficiency']).optional(),
  confidence: z.number().int().min(0).max(100).nullish(),
})

export default defineEventHandler(async (event): Promise<PmsPlan> => {
  const { user } = await requireUserSession(event)
  const body = await readValidatedBody(event, createSchema.parse)
  const plan = createPmsPlan(db, body)
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Added post-market plan',
    impact: 'medium', entityType: 'pms_plans', entityRef: plan.planType,
  })
  return plan
})
