import { getClinicalOverview } from '../../utils/clinical'
import { db } from '../../utils/db'
import type { ClinicalOverview } from '#shared/types/clinical'

export default defineEventHandler((): ClinicalOverview => getClinicalOverview(db))
