// Risk register CRUD (FR-RISK-1) within a technical file.
import { createError } from 'h3'
import { eq } from 'drizzle-orm'
import type { Db } from './createDb'
import { definedFields } from './patch'
import { riskEntries } from '../database/schema'
import type { RiskEntry, RiskSeverity, RiskStatus } from '#shared/types/risk'

export interface CreateRiskInput {
  technicalFileId: number
  riskId: string
  hazardDescription: string
  severity: RiskSeverity
  probability?: string | null
  status?: RiskStatus
  mitigation?: string | null
  controlMeasureRef?: string | null
  verificationRef?: string | null
  traceabilityRefs?: string[]
}

export interface UpdateRiskInput {
  riskId?: string
  hazardDescription?: string
  severity?: RiskSeverity
  probability?: string | null
  status?: RiskStatus
  mitigation?: string | null
  controlMeasureRef?: string | null
  verificationRef?: string | null
  traceabilityRefs?: string[]
}

/** Add a risk entry to a technical file. */
export function createRisk(db: Db, input: CreateRiskInput): RiskEntry {
  const [entry] = db.insert(riskEntries).values({
    technicalFileId: input.technicalFileId,
    riskId: input.riskId,
    hazardDescription: input.hazardDescription,
    severity: input.severity,
    probability: input.probability ?? null,
    status: input.status ?? 'draft',
    mitigation: input.mitigation ?? null,
    controlMeasureRef: input.controlMeasureRef ?? null,
    verificationRef: input.verificationRef ?? null,
    traceabilityRefs: input.traceabilityRefs ?? [],
    updatedAt: new Date().toISOString(),
  }).returning().all()
  if (!entry) throw createError({ statusCode: 500, statusMessage: 'Failed to create risk entry' })
  return entry
}

/** Update a risk entry. */
export function updateRisk(db: Db, id: number, input: UpdateRiskInput): RiskEntry {
  const [existing] = db.select().from(riskEntries).where(eq(riskEntries.id, id)).all()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Risk entry not found' })

  const [entry] = db.update(riskEntries)
    .set({ ...definedFields(input), updatedAt: new Date().toISOString() })
    .where(eq(riskEntries.id, id)).returning().all()
  if (!entry) throw createError({ statusCode: 500, statusMessage: 'Failed to update risk entry' })
  return entry
}

/** Delete a risk entry. Returns the deleted risk's ref for the audit trail. */
export function deleteRisk(db: Db, id: number): { id: number, riskId: string } {
  const [existing] = db.select().from(riskEntries).where(eq(riskEntries.id, id)).all()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Risk entry not found' })

  db.delete(riskEntries).where(eq(riskEntries.id, id)).run()
  return { id, riskId: existing.riskId }
}
