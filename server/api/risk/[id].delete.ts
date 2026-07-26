import { deleteRisk } from '../../utils/risk'
import { writeAuditLog } from '../../utils/auditLog'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'

export default defineEventHandler(async (event): Promise<{ id: number, riskId: string }> => {
  const { user } = await requireUserSession(event)
  const result = deleteRisk(db, getIdParam(event))
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Deleted risk entry',
    impact: 'medium', entityType: 'risk_entries', entityRef: result.riskId,
  })
  return result
})
