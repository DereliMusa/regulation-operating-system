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

/** A clinical evidence record joined to its device name. */
export interface ClinicalEvidenceItem extends ClinicalEvidence {
  deviceName: string
}

export interface ClinicalSummary {
  total: number
  approved: number
  inReview: number
  avgConfidence: number
}

/** Clinical Evaluation screen payload (GET /api/clinical). */
export interface ClinicalOverview {
  items: ClinicalEvidenceItem[]
  summary: ClinicalSummary
  /** Records carrying a mock AI summary, highest confidence first. */
  aiSuggestions: ClinicalEvidenceItem[]
}
