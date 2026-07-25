import { z } from 'zod'
import { listTechnicalFiles } from '../../utils/technicalFiles'
import { db } from '../../utils/db'
import type { TechnicalFileList } from '#shared/types/technical-file'

const querySchema = z.object({
  status: z.enum(['draft', 'in_review', 'approved', 'deficiency']).optional(),
  regulation: z.enum(['MDR', 'IVDR']).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(50).optional(),
})

export default defineEventHandler((event): TechnicalFileList => {
  const query = querySchema.parse(getQuery(event))
  return listTechnicalFiles(db, query)
})
