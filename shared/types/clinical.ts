export type ClinicalSourceType = 'literature' | 'investigation' | 'pms'
export type ClinicalEvidenceStatus = 'approved' | 'in_review' | 'draft' | 'deficiency'

export interface ClinicalEvidence {
  id: number
  technicalFileId: number
  cerRef: string
  sourceType: ClinicalSourceType
  title: string
  status: ClinicalEvidenceStatus
  aiSummary: string | null
  confidence: number | null
  updatedAt: string
}
