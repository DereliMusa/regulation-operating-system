import { z } from 'zod'
import { runAuditorSimulation } from '../../utils/auditorRules'
import { getTechnicalFileDetail } from '../../utils/technicalFiles'
import { db } from '../../utils/db'
import type { AuditorSimulationResult } from '#shared/types/auditor'

const bodySchema = z.object({
  technicalFileId: z.number().int().positive(),
})

export default defineEventHandler(async (event): Promise<AuditorSimulationResult> => {
  const { technicalFileId } = await readValidatedBody(event, bodySchema.parse)
  const file = getTechnicalFileDetail(db, technicalFileId) // throws 404 when missing
  return runAuditorSimulation({
    technicalFileId: file.id,
    deviceName: file.deviceName,
    regulation: file.regulation,
    readinessPercent: file.readinessPercent,
    gspr: file.gspr,
    risks: file.risks,
  })
})
