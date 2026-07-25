import { getTechnicalFileDetail } from '../../utils/technicalFiles'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'
import type { TechnicalFileDetail } from '#shared/types/technical-file'

export default defineEventHandler((event): TechnicalFileDetail => {
  return getTechnicalFileDetail(db, getIdParam(event))
})
