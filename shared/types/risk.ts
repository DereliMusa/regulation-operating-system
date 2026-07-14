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
