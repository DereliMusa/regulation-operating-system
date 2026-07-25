import { z } from 'zod'
import { updateTechnicalFile } from '../../utils/technicalFiles'
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
  const id = getIdParam(event)
  const body = await readValidatedBody(event, patchSchema.parse)
  return updateTechnicalFile(db, id, body)
})
