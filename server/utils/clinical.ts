// Clinical Evaluation overview (FR-CER-1): evidence records joined to their
// device, a summary, and the mock-AI suggestions panel. Read-only over seed data.
import type { Db } from './createDb'
import { clinicalEvidence, technicalFiles } from '../database/schema'
import type { ClinicalEvidenceItem, ClinicalOverview } from '#shared/types/clinical'

/**
 * Aggregate the Clinical Evaluation screen: all clinical evidence joined to its
 * device, a status/confidence summary, and the AI-summarized records (highest
 * confidence first) for the AI-suggestions panel.
 */
export function getClinicalOverview(db: Db): ClinicalOverview {
  const evidence = db.select().from(clinicalEvidence).all()
  const files = db.select().from(technicalFiles).all()
  const deviceName = new Map(files.map(f => [f.id, f.deviceName]))

  const items: ClinicalEvidenceItem[] = evidence.map(e => ({
    ...e,
    deviceName: deviceName.get(e.technicalFileId) ?? 'Unknown device',
  }))

  const scored = items.filter(i => i.confidence != null)
  const avgConfidence = scored.length
    ? Math.round(scored.reduce((sum, i) => sum + (i.confidence ?? 0), 0) / scored.length)
    : 0

  const aiSuggestions = items
    .filter(i => i.aiSummary != null)
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))

  return {
    items,
    summary: {
      total: items.length,
      approved: items.filter(i => i.status === 'approved').length,
      inReview: items.filter(i => i.status === 'in_review').length,
      avgConfidence,
    },
    aiSuggestions,
  }
}
