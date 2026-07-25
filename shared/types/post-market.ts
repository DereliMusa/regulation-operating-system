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

/** A post-market plan joined to its device name with days-until-due. */
export interface PmsPlanItem extends PmsPlan {
  deviceName: string
  daysRemaining: number
}

export interface PostMarketSummary {
  total: number
  byType: Record<PmsPlanType, number>
  overdue: number
  dueSoon: number
}

/** Post-Market screen payload (GET /api/post-market), soonest-due first. */
export interface PostMarketOverview {
  items: PmsPlanItem[]
  summary: PostMarketSummary
}
