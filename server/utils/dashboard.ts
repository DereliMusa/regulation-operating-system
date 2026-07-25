// Dashboard aggregation (FR-DASH-1..4). Kept in server/utils (not inline in the
// route) so it is unit-testable against an in-memory seeded database, like auth.ts
// and demoRequests.ts.
import type { Db } from './createDb'
import { technicalFiles, auditorFindings, clinicalEvidence, pmsPlans } from '../database/schema'
import type {
  DashboardStats,
  DashboardFileSummary,
  DashboardApproval,
  DashboardDeadline,
  DashboardAiDraft,
  DashboardFinding,
} from '#shared/types/dashboard'

type FileRow = typeof technicalFiles.$inferSelect
type FindingRow = typeof auditorFindings.$inferSelect
type ClinicalRow = typeof clinicalEvidence.$inferSelect
type PmsRow = typeof pmsPlans.$inferSelect

// Findings table ordering: most severe first.
const SEVERITY_RANK: Record<string, number> = { critical: 0, major: 1, minor: 2 }

const UNKNOWN_DEVICE = 'Unknown device'

/** Whole days from now until an ISO date (negative once the date is past). */
function daysUntil(dateIso: string, now = Date.now()): number {
  return Math.ceil((Date.parse(dateIso) - now) / 86_400_000)
}

/** Mean readiness across the portfolio, rounded (0 when there are no files). */
function overallReadiness(files: FileRow[]): number {
  if (files.length === 0) return 0
  return Math.round(files.reduce((sum, f) => sum + f.readinessPercent, 0) / files.length)
}

function buildFileSummaries(files: FileRow[]): DashboardFileSummary[] {
  return [...files]
    .sort((a, b) => b.readinessPercent - a.readinessPercent)
    .map(f => ({
      id: f.id,
      deviceName: f.deviceName,
      deviceClass: f.deviceClass,
      regulation: f.regulation,
      readinessPercent: f.readinessPercent,
      status: f.status,
    }))
}

function buildFindings(findings: FindingRow[], deviceName: Map<number, string>): DashboardFinding[] {
  return findings
    .filter(f => f.status === 'open')
    .sort((a, b) => (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9))
    .map(f => ({
      id: f.id,
      severity: f.severity,
      description: f.description,
      recommendation: f.recommendation,
      gsprRef: f.gsprRef,
      deviceName: deviceName.get(f.technicalFileId) ?? UNKNOWN_DEVICE,
    }))
}

function buildDeadlines(plans: PmsRow[], deviceName: Map<number, string>): DashboardDeadline[] {
  return plans
    .map(p => ({
      planType: p.planType,
      deviceName: p.deviceRef ?? deviceName.get(p.technicalFileId) ?? UNKNOWN_DEVICE,
      dueDate: p.nextDue,
      daysRemaining: daysUntil(p.nextDue),
      status: p.status,
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
}

/** Artifacts in a human-review state, across files, clinical, and post-market. */
function buildApprovals(files: FileRow[], clinical: ClinicalRow[], plans: PmsRow[], deviceName: Map<number, string>): DashboardApproval[] {
  const approvals: DashboardApproval[] = []
  for (const f of files) {
    if (f.status === 'in_review') approvals.push({ ref: f.deviceName, title: f.deviceName, kind: 'Technical file', deviceName: f.deviceName })
  }
  for (const c of clinical) {
    if (c.status === 'in_review') approvals.push({ ref: c.cerRef, title: c.title, kind: 'Clinical evaluation', deviceName: deviceName.get(c.technicalFileId) ?? UNKNOWN_DEVICE })
  }
  for (const p of plans) {
    if (p.status === 'pending_review') approvals.push({ ref: p.planType, title: `${p.planType} report`, kind: 'Post-market', deviceName: p.deviceRef ?? deviceName.get(p.technicalFileId) ?? UNKNOWN_DEVICE })
  }
  return approvals
}

/** Mock AI drafts (confidence-scored, not yet finalized) awaiting verification. */
function buildAiDrafts(clinical: ClinicalRow[], plans: PmsRow[], deviceName: Map<number, string>): DashboardAiDraft[] {
  const drafts: DashboardAiDraft[] = []
  for (const c of clinical) {
    if (c.status !== 'approved' && c.confidence != null) drafts.push({ ref: c.cerRef, title: c.title, kind: 'Clinical summary', confidence: c.confidence, deviceName: deviceName.get(c.technicalFileId) ?? UNKNOWN_DEVICE })
  }
  for (const p of plans) {
    if (p.status !== 'active' && p.confidence != null) drafts.push({ ref: p.planType, title: `${p.planType} draft`, kind: 'Post-market', confidence: p.confidence, deviceName: p.deviceRef ?? deviceName.get(p.technicalFileId) ?? UNKNOWN_DEVICE })
  }
  return drafts.sort((a, b) => b.confidence - a.confidence)
}

/**
 * Aggregate the dashboard payload (FR-DASH-1..4) from the current database:
 * overall portfolio readiness, per-file readiness, pending approvals, upcoming
 * post-market deadlines, mock AI drafts, and open deficiency findings.
 *
 * @param db - the Drizzle database instance
 * @returns the fully-computed dashboard statistics
 */
export function getDashboardStats(db: Db): DashboardStats {
  const files = db.select().from(technicalFiles).all()
  const findings = db.select().from(auditorFindings).all()
  const clinical = db.select().from(clinicalEvidence).all()
  const plans = db.select().from(pmsPlans).all()
  const deviceName = new Map(files.map(f => [f.id, f.deviceName]))

  const approvals = buildApprovals(files, clinical, plans, deviceName)
  const aiDrafts = buildAiDrafts(clinical, plans, deviceName)
  const openFindings = buildFindings(findings, deviceName)

  return {
    readiness: { overallPercent: overallReadiness(files), activeFileCount: files.length },
    files: buildFileSummaries(files),
    approvals,
    deadlines: buildDeadlines(plans, deviceName),
    aiDrafts,
    findings: openFindings,
    counts: {
      files: files.length,
      openFindings: openFindings.length,
      pendingApprovals: approvals.length,
      aiDrafts: aiDrafts.length,
    },
  }
}
