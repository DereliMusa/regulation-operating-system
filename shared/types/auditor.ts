export type FindingSeverity = 'critical' | 'major' | 'minor'
export type FindingStatus = 'open' | 'resolved'

export interface AuditorFinding {
  id: number
  technicalFileId: number
  severity: FindingSeverity
  gsprRef: string | null
  description: string
  recommendation: string | null
  status: FindingStatus
  createdAt: string
  resolvedAt: string | null
}
