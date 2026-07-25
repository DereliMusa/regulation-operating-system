// GSPR matrix CRUD (FR-GSPR-1). Every mutation recomputes the parent file's
// readiness from GSPR conformity (FR-TF-4).
import { createError } from 'h3'
import { eq } from 'drizzle-orm'
import type { Db } from './createDb'
import { definedFields } from './patch'
import { refreshReadiness } from './technicalFiles'
import { gsprEntries } from '../database/schema'
import type { GsprEntry, GsprConformity } from '#shared/types/gspr'

export interface CreateGsprInput {
  technicalFileId: number
  gsprRef: string
  requirementText: string
  conformity: GsprConformity
  evidenceRefs?: string[]
  standardRefs?: string[]
  notes?: string | null
}

export interface UpdateGsprInput {
  gsprRef?: string
  requirementText?: string
  conformity?: GsprConformity
  evidenceRefs?: string[]
  standardRefs?: string[]
  notes?: string | null
}

/** Add a GSPR entry to a technical file and refresh its readiness. */
export function createGspr(db: Db, input: CreateGsprInput): GsprEntry {
  const [entry] = db.insert(gsprEntries).values({
    technicalFileId: input.technicalFileId,
    gsprRef: input.gsprRef,
    requirementText: input.requirementText,
    conformity: input.conformity,
    evidenceRefs: input.evidenceRefs ?? [],
    standardRefs: input.standardRefs ?? [],
    notes: input.notes ?? null,
    updatedAt: new Date().toISOString(),
  }).returning().all()
  if (!entry) throw createError({ statusCode: 500, statusMessage: 'Failed to create GSPR entry' })

  refreshReadiness(db, input.technicalFileId)
  return entry
}

/** Update a GSPR entry and refresh its file's readiness. */
export function updateGspr(db: Db, id: number, input: UpdateGsprInput): GsprEntry {
  const [existing] = db.select().from(gsprEntries).where(eq(gsprEntries.id, id)).all()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'GSPR entry not found' })

  const [entry] = db.update(gsprEntries)
    .set({ ...definedFields(input), updatedAt: new Date().toISOString() })
    .where(eq(gsprEntries.id, id)).returning().all()
  if (!entry) throw createError({ statusCode: 500, statusMessage: 'Failed to update GSPR entry' })

  refreshReadiness(db, entry.technicalFileId)
  return entry
}

/** Delete a GSPR entry and refresh its file's readiness. */
export function deleteGspr(db: Db, id: number): { id: number } {
  const [existing] = db.select().from(gsprEntries).where(eq(gsprEntries.id, id)).all()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'GSPR entry not found' })

  db.delete(gsprEntries).where(eq(gsprEntries.id, id)).run()
  refreshReadiness(db, existing.technicalFileId)
  return { id }
}
