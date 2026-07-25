import { deleteGspr } from '../../utils/gspr'
import { getIdParam } from '../../utils/routeParams'
import { db } from '../../utils/db'

export default defineEventHandler((event): { id: number } => {
  return deleteGspr(db, getIdParam(event))
})
