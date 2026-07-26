import { deleteClinicalEvidence } from '../../utils/clinical'
import { writeAuditLog } from '../../utils/auditLog'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'

export default defineEventHandler(async (event): Promise<{ id: number, cerRef: string }> => {
  const { user } = await requireUserSession(event)
  const result = deleteClinicalEvidence(db, getIdParam(event))
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Deleted clinical evidence',
    impact: 'medium', entityType: 'clinical_evidence', entityRef: result.cerRef,
  })
  return result
})
