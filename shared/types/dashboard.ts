import type { DeviceClass, Regulation, TechnicalFileStatus } from './technical-file'
import type { PmsPlanType, PmsPlanStatus } from './post-market'
import type { FindingSeverity } from './auditor'

/** One active technical file summarized for the dashboard readiness list. */
export interface DashboardFileSummary {
  id: number
  deviceName: string
  deviceClass: DeviceClass | null
  regulation: Regulation
  readinessPercent: number
  status: TechnicalFileStatus
}

/** An artifact awaiting a human review/sign-off. */
export interface DashboardApproval {
  ref: string
  title: string
  kind: string
  deviceName: string
}

/** A post-market plan deadline with days remaining until it is due. */
export interface DashboardDeadline {
  planType: PmsPlanType
  deviceName: string
  dueDate: string
  daysRemaining: number
  status: PmsPlanStatus
}

/** A mock AI draft awaiting human verification (see ADR 005). */
export interface DashboardAiDraft {
  ref: string
  title: string
  kind: string
  confidence: number
  deviceName: string
}

/** An open auditor/deficiency finding surfaced on the dashboard. */
export interface DashboardFinding {
  id: number
  severity: FindingSeverity
  description: string
  recommendation: string | null
  gsprRef: string | null
  deviceName: string
}

/** Aggregated dashboard payload returned by GET /api/dashboard/stats. */
export interface DashboardStats {
  readiness: { overallPercent: number, activeFileCount: number }
  files: DashboardFileSummary[]
  approvals: DashboardApproval[]
  deadlines: DashboardDeadline[]
  aiDrafts: DashboardAiDraft[]
  findings: DashboardFinding[]
  counts: { files: number, openFindings: number, pendingApprovals: number, aiDrafts: number }
}
