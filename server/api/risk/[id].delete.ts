import { deleteRisk } from '../../utils/risk'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'

export default defineEventHandler((event): { id: number } => {
  return deleteRisk(db, getIdParam(event))
})
