export type RiskSeverity = 'critical' | 'major' | 'moderate' | 'minor'
export type RiskStatus = 'draft' | 'review' | 'mitigated'

export interface RiskEntry {
  id: number
  technicalFileId: number
  riskId: string
  hazardDescription: string
  severity: RiskSeverity
  probability: string | null
  status: RiskStatus
  mitigation: string | null
  controlMeasureRef: string | null
  verificationRef: string | null
  traceabilityRefs: string[]
  updatedAt: string
}

/** A risk entry joined to its device name, for the standalone register. */
export interface RiskRegisterItem extends RiskEntry {
  deviceName: string
}

export interface RiskRegisterSummary {
  total: number
  bySeverity: Record<RiskSeverity, number>
  unmitigated: number
}

/** Portfolio risk register payload (GET /api/risk). */
export interface RiskRegisterView {
  items: RiskRegisterItem[]
  summary: RiskRegisterSummary
}
