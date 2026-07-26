// Clinical Evaluation module (FR-CER-1 read, FR-CER-2 CRUD): evidence records
// joined to their device, a summary, and the mock-AI suggestions panel, plus
// create/update/delete of evidence records. Pure and Nuxt-free so it is
// unit-testable against an in-memory database.
import { createError } from 'h3'
import { eq } from 'drizzle-orm'
import type { Db } from './createDb'
import { definedFields } from './patch'
import { clinicalEvidence, technicalFiles } from '../database/schema'
import type {
  ClinicalEvidence,
  ClinicalEvidenceItem,
  ClinicalEvidenceStatus,
  ClinicalOverview,
  ClinicalSourceType,
} from '#shared/types/clinical'

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

export interface CreateClinicalEvidenceInput {
  technicalFileId: number
  cerRef: string
  sourceType: ClinicalSourceType
  title: string
  status?: ClinicalEvidenceStatus
  aiSummary?: string | null
  confidence?: number | null
}

export interface UpdateClinicalEvidenceInput {
  cerRef?: string
  sourceType?: ClinicalSourceType
  title?: string
  status?: ClinicalEvidenceStatus
  aiSummary?: string | null
  confidence?: number | null
}

/** Add a clinical evidence record to a technical file (FR-CER-2). */
export function createClinicalEvidence(db: Db, input: CreateClinicalEvidenceInput): ClinicalEvidence {
  const [entry] = db.insert(clinicalEvidence).values({
    technicalFileId: input.technicalFileId,
    cerRef: input.cerRef,
    sourceType: input.sourceType,
    title: input.title,
    status: input.status ?? 'draft',
    aiSummary: input.aiSummary ?? null,
    confidence: input.confidence ?? null,
    updatedAt: new Date().toISOString(),
  }).returning().all()
  if (!entry) throw createError({ statusCode: 500, statusMessage: 'Failed to create clinical evidence' })
  return entry
}

/** Update a clinical evidence record (FR-CER-2). */
export function updateClinicalEvidence(db: Db, id: number, input: UpdateClinicalEvidenceInput): ClinicalEvidence {
  const [existing] = db.select().from(clinicalEvidence).where(eq(clinicalEvidence.id, id)).all()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Clinical evidence not found' })

  const [entry] = db.update(clinicalEvidence)
    .set({ ...definedFields(input), updatedAt: new Date().toISOString() })
    .where(eq(clinicalEvidence.id, id)).returning().all()
  if (!entry) throw createError({ statusCode: 500, statusMessage: 'Failed to update clinical evidence' })
  return entry
}

/** Delete a clinical evidence record. Returns its ref for the audit trail. */
export function deleteClinicalEvidence(db: Db, id: number): { id: number, cerRef: string } {
  const [existing] = db.select().from(clinicalEvidence).where(eq(clinicalEvidence.id, id)).all()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Clinical evidence not found' })

  db.delete(clinicalEvidence).where(eq(clinicalEvidence.id, id)).run()
  return { id, cerRef: existing.cerRef }
}
