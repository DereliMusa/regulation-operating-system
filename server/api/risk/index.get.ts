import { getRiskRegister } from '../../utils/riskRegister'
import { db } from '../../utils/db'
import type { RiskRegisterView } from '#shared/types/risk'

export default defineEventHandler((): RiskRegisterView => getRiskRegister(db))
