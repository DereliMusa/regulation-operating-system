import { z } from 'zod'
import { createTechnicalFile } from '../../utils/technicalFiles'
import { writeAuditLog } from '../../utils/auditLog'
import { db } from '../../utils/db'
import type { TechnicalFile } from '#shared/types/technical-file'

const createSchema = z.object({
  deviceName: z.string().min(1, 'Device name is required').max(200),
  udiDi: z.string().max(100).optional(),
  deviceClass: z.enum(['I', 'IIa', 'IIb', 'III', 'A', 'B', 'C', 'D']).optional(),
  regulation: z.enum(['MDR', 'IVDR']),
  notifiedBody: z.string().max(200).optional(),
  intendedUse: z.string().max(2000).optional(),
})

export default defineEventHandler(async (event): Promise<TechnicalFile> => {
  const { user } = await requireUserSession(event)
  const body = await readValidatedBody(event, createSchema.parse)
  const file = createTechnicalFile(db, body, user.id)
  writeAuditLog(db, {
    actorType: 'user', actorName: user.name, action: 'Created technical file',
    impact: 'low', entityType: 'technical_files', entityRef: file.deviceName,
  })
  return file
})
