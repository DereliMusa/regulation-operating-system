// Technical-file domain logic (FR-TF-*). Kept in server/utils so it is
// unit-testable against an in-memory seeded database.
import { createError } from 'h3'
import { and, eq, like, desc, sql } from 'drizzle-orm'
import type { Db } from './createDb'
import { definedFields } from './patch'
import { technicalFiles, gsprEntries, riskEntries } from '../database/schema'
import type {
  TechnicalFile,
  TechnicalFileList,
  TechnicalFileDetail,
  DeviceClass,
  Regulation,
  TechnicalFileStatus,
} from '#shared/types/technical-file'
import type { GsprConformity } from '#shared/types/gspr'

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

// GSPR conformity -> readiness contribution (percent).
const CONFORMITY_SCORE: Record<GsprConformity, number> = { conforming: 100, partial: 50, missing: 0 }

export interface TechnicalFileFilters {
  status?: TechnicalFileStatus
  regulation?: Regulation
  search?: string
  page?: number
  pageSize?: number
}

export interface CreateTechnicalFileInput {
  deviceName: string
  udiDi?: string | null
  deviceClass?: DeviceClass | null
  regulation: Regulation
  notifiedBody?: string | null
  intendedUse?: string | null
}

export interface UpdateTechnicalFileInput {
  deviceName?: string
  udiDi?: string | null
  deviceClass?: DeviceClass | null
  regulation?: Regulation
  notifiedBody?: string | null
  intendedUse?: string | null
  status?: TechnicalFileStatus
}

/**
 * Compliance readiness as the mean GSPR conformity score (FR-TF-4).
 * @returns 0-100, or 0 when there are no GSPR entries yet
 */
export function computeReadiness(entries: Array<{ conformity: GsprConformity }>): number {
  if (entries.length === 0) return 0
  const total = entries.reduce((sum, e) => sum + CONFORMITY_SCORE[e.conformity], 0)
  return Math.round(total / entries.length)
}

/** Recompute and persist a file's readiness from its current GSPR entries. */
export function refreshReadiness(db: Db, technicalFileId: number): number {
  const entries = db.select({ conformity: gsprEntries.conformity }).from(gsprEntries)
    .where(eq(gsprEntries.technicalFileId, technicalFileId)).all()
  const readiness = computeReadiness(entries)
  db.update(technicalFiles)
    .set({ readinessPercent: readiness, updatedAt: new Date().toISOString() })
    .where(eq(technicalFiles.id, technicalFileId)).run()
  return readiness
}

/** List technical files with optional filters and pagination (FR-TF-1). */
export function listTechnicalFiles(db: Db, filters: TechnicalFileFilters = {}): TechnicalFileList {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE))

  const conditions = []
  if (filters.status) conditions.push(eq(technicalFiles.status, filters.status))
  if (filters.regulation) conditions.push(eq(technicalFiles.regulation, filters.regulation))
  if (filters.search) conditions.push(like(technicalFiles.deviceName, `%${filters.search}%`))
  const where = conditions.length ? and(...conditions) : undefined

  const items = db.select().from(technicalFiles).where(where)
    .orderBy(desc(technicalFiles.updatedAt))
    .limit(pageSize).offset((page - 1) * pageSize).all()
  const [countRow] = db.select({ count: sql<number>`count(*)` }).from(technicalFiles).where(where).all()

  return { items, total: Number(countRow?.count ?? 0), page, pageSize }
}

/** A technical file with its GSPR matrix and risk register (FR-TF-3). */
export function getTechnicalFileDetail(db: Db, id: number): TechnicalFileDetail {
  const [file] = db.select().from(technicalFiles).where(eq(technicalFiles.id, id)).all()
  if (!file) throw createError({ statusCode: 404, statusMessage: 'Technical file not found' })

  const gspr = db.select().from(gsprEntries).where(eq(gsprEntries.technicalFileId, id)).all()
  const risks = db.select().from(riskEntries).where(eq(riskEntries.technicalFileId, id)).all()
  return { ...file, gspr, risks }
}

/** Create a technical file owned by the current user (FR-TF-2). */
export function createTechnicalFile(db: Db, input: CreateTechnicalFileInput, ownerId: number): TechnicalFile {
  const now = new Date().toISOString()
  const [file] = db.insert(technicalFiles).values({
    deviceName: input.deviceName,
    udiDi: input.udiDi ?? null,
    deviceClass: input.deviceClass ?? null,
    regulation: input.regulation,
    notifiedBody: input.notifiedBody ?? null,
    intendedUse: input.intendedUse ?? null,
    readinessPercent: 0,
    status: 'draft',
    ownerId,
    createdAt: now,
    updatedAt: now,
  }).returning().all()
  if (!file) throw createError({ statusCode: 500, statusMessage: 'Failed to create technical file' })
  return file
}

/** Update technical-file metadata (FR-TF-4). */
export function updateTechnicalFile(db: Db, id: number, input: UpdateTechnicalFileInput): TechnicalFile {
  const [existing] = db.select().from(technicalFiles).where(eq(technicalFiles.id, id)).all()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Technical file not found' })

  const [file] = db.update(technicalFiles)
    .set({ ...definedFields(input), updatedAt: new Date().toISOString() })
    .where(eq(technicalFiles.id, id)).returning().all()
  if (!file) throw createError({ statusCode: 500, statusMessage: 'Failed to update technical file' })
  return file
}
