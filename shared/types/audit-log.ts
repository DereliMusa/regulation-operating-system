export type AuditActorType = 'user' | 'ai' | 'system'
export type AuditImpact = 'critical' | 'high' | 'medium' | 'low'

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
