import { deleteGspr } from '../../utils/gspr'
import { writeAuditLog } from '../../utils/auditLog'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'

export default defineEventHandler(async (event): Promise<{ id: number, gsprRef: string }> => {
  const { user } = await requireUserSession(event)
  const result = deleteGspr(db, getIdParam(event))
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Deleted GSPR entry',
    impact: 'medium', entityType: 'gspr_entries', entityRef: result.gsprRef,
  })
  return result
})
