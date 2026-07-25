import { z } from 'zod'
import { updateTechnicalFile } from '../../utils/technicalFiles'
import { writeAuditLog } from '../../utils/auditLog'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'
import type { TechnicalFile } from '#shared/types/technical-file'

const patchSchema = z.object({
  deviceName: z.string().min(1).max(200).optional(),
  udiDi: z.string().max(100).nullish(),
  deviceClass: z.enum(['I', 'IIa', 'IIb', 'III', 'A', 'B', 'C', 'D']).nullish(),
  regulation: z.enum(['MDR', 'IVDR']).optional(),
  notifiedBody: z.string().max(200).nullish(),
  intendedUse: z.string().max(2000).nullish(),
  status: z.enum(['draft', 'in_review', 'approved', 'deficiency']).optional(),
})

export default defineEventHandler(async (event): Promise<TechnicalFile> => {
  const { user } = await requireUserSession(event)
  const id = getIdParam(event)
  const body = await readValidatedBody(event, patchSchema.parse)
  const file = updateTechnicalFile(db, id, body)
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Updated technical file',
    impact: 'medium', entityType: 'technical_files', entityRef: file.deviceName,
  })
  return file
})
