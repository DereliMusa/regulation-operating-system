export type AuditActorType = 'user' | 'ai' | 'system'
export type AuditImpact = 'critical' | 'high' | 'medium' | 'low'

/** One activity-trail entry, written automatically on every mutation (FR-LOG-1). */
export interface AuditLogEntry {
  id: number
  logRef: string
  actorType: AuditActorType
  actorName: string
  action: string
  description: string | null
  impact: AuditImpact
  entityType: string | null
  entityRef: string | null
  createdAt: string
}

/** KPI cards for the Audit Log screen, computed over the whole log. */
export interface AuditLogKpis {
  total: number
  highImpact: number
  aiActions: number
  last7Days: number
}

/** Audit Log screen payload (GET /api/audit-log): filtered entries + KPIs. */
export interface AuditLogView {
  items: AuditLogEntry[]
  kpis: AuditLogKpis
}
