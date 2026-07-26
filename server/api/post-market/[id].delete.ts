import { deletePmsPlan } from '../../utils/postMarket'
import { writeAuditLog } from '../../utils/auditLog'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'

export default defineEventHandler(async (event): Promise<{ id: number, planType: string }> => {
  const { user } = await requireUserSession(event)
  const result = deletePmsPlan(db, getIdParam(event))
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Deleted post-market plan',
    impact: 'medium', entityType: 'pms_plans', entityRef: result.planType,
  })
  return result
})
