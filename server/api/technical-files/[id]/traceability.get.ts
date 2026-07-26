// Traceability graph for one technical file (FR-TRC-2). Thin route: assembles the
// file's GSPR, risk and clinical entities from the DB and hands them to the pure
// graph builder (mirrors the auditor route pattern).
import { getTechnicalFileDetail } from '../../../utils/technicalFiles'
import { getClinicalEvidenceForFile } from '../../../utils/clinical'
import { buildTraceabilityGraph } from '../../../utils/traceability'
import { getIdParam } from '../../../utils/routeParams'
import { db } from '../../../utils/db'
import type { TraceabilityGraph } from '#shared/types/traceability'

export default defineEventHandler((event): TraceabilityGraph => {
  const id = getIdParam(event)
  const file = getTechnicalFileDetail(db, id) // throws 404 when the file is missing
  return buildTraceabilityGraph({
    technicalFileId: file.id,
    deviceName: file.deviceName,
    gspr: file.gspr,
    risks: file.risks,
    clinical: getClinicalEvidenceForFile(db, id),
  })
})
