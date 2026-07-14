export type PmsPlanType = 'PMS' | 'PMCF' | 'PSUR'
export type PmsPlanStatus = 'pending_review' | 'active' | 'drafting' | 'deficiency'

export interface PmsPlan {
  id: number
  technicalFileId: number
  planType: PmsPlanType
  deviceRef: string | null
  nextDue: string
  status: PmsPlanStatus
  confidence: number | null
  updatedAt: string
}
