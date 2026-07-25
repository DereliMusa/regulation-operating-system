// Activity trail (FR-LOG-1/2). writeAuditLog is called by every mutation route
// to record who did what; getAuditLogView backs the Audit Log screen. Pure and
// Nuxt-free so both are unit-testable against an in-memory database.
import { desc } from 'drizzle-orm'
import type { Db } from './createDb'
import { auditLog } from '../database/schema'
import type {
  AuditActorType,
  AuditImpact,
  AuditLogEntry,
  AuditLogKpis,
  AuditLogView,
} from '#shared/types/audit-log'

export interface WriteAuditInput {
  actorType: AuditActorType
  actorName: string
  action: string
  impact: AuditImpact
  description?: string | null
  entityType?: string | null
  entityRef?: string | null
}

/** Record an audit-trail entry for a mutation (FR-LOG-1). */
export function writeAuditLog(db: Db, input: WriteAuditInput): void {
  db.insert(auditLog).values({
    logRef: `LOG-${Math.floor(10000 + Math.random() * 89999)}`,
    actorType: input.actorType,
    actorName: input.actorName,
    action: input.action,
    description: input.description ?? null,
    impact: input.impact,
    entityType: input.entityType ?? null,
    entityRef: input.entityRef ?? null,
    createdAt: new Date().toISOString(),
  }).run()
}

export interface AuditLogFilters {
  actorType?: AuditActorType
  impact?: AuditImpact
  search?: string
}

/** KPI cards computed over the full log (not the filtered view). */
function computeKpis(rows: AuditLogEntry[], now = Date.now()): AuditLogKpis {
  const weekAgo = now - 7 * 86_400_000
  return {
    total: rows.length,
    highImpact: rows.filter(r => r.impact === 'critical' || r.impact === 'high').length,
    aiActions: rows.filter(r => r.actorType === 'ai').length,
    last7Days: rows.filter(r => Date.parse(r.createdAt) >= weekAgo).length,
  }
}

/**
 * The Audit Log screen payload (FR-LOG-2): all entries newest-first, filtered by
 * actor/impact/search, plus KPI cards computed over the whole log.
 *
 * @param db - the Drizzle database instance
 * @param filters - optional actorType / impact / free-text search
 * @returns the filtered entries and the full-log KPIs
 */
export function getAuditLogView(db: Db, filters: AuditLogFilters = {}): AuditLogView {
  const all = db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).all()
  const kpis = computeKpis(all)

  let items = all
  if (filters.actorType) items = items.filter(r => r.actorType === filters.actorType)
  if (filters.impact) items = items.filter(r => r.impact === filters.impact)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    items = items.filter(r =>
      r.action.toLowerCase().includes(q)
      || r.actorName.toLowerCase().includes(q)
      || (r.entityRef?.toLowerCase().includes(q) ?? false),
    )
  }

  return { items, kpis }
}
