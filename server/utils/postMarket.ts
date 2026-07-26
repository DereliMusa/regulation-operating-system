// Post-Market module (FR-PMS-1 read, FR-PMS-2 CRUD): surveillance plans joined
// to their device with days-until-due, soonest first (the milestone timeline),
// a summary, plus create/update/delete of plans. Pure and Nuxt-free so it is
// unit-testable against an in-memory database.
import { createError } from 'h3'
import { eq } from 'drizzle-orm'
import type { Db } from './createDb'
import { definedFields } from './patch'
import { pmsPlans, technicalFiles } from '../database/schema'
import type {
  PmsPlan,
  PmsPlanItem,
  PmsPlanStatus,
  PmsPlanType,
  PostMarketOverview,
} from '#shared/types/post-market'

/** Whole days from now until an ISO date (negative once past). */
function daysUntil(dateIso: string, now = Date.now()): number {
  return Math.ceil((Date.parse(dateIso) - now) / 86_400_000)
}

/**
 * Aggregate the Post-Market screen: all PMS/PMCF/PSUR plans joined to their
 * device and sorted soonest-due first, with counts by type plus overdue and
 * due-soon (<= 30 days) tallies.
 */
export function getPostMarketOverview(db: Db): PostMarketOverview {
  const plans = db.select().from(pmsPlans).all()
  const files = db.select().from(technicalFiles).all()
  const deviceName = new Map(files.map(f => [f.id, f.deviceName]))

  const items: PmsPlanItem[] = plans
    .map(p => ({
      ...p,
      deviceName: p.deviceRef ?? deviceName.get(p.technicalFileId) ?? 'Unknown device',
      daysRemaining: daysUntil(p.nextDue),
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining)

  const byType: Record<PmsPlanType, number> = { PMS: 0, PMCF: 0, PSUR: 0 }
  for (const p of items) byType[p.planType]++

  return {
    items,
    summary: {
      total: items.length,
      byType,
      overdue: items.filter(p => p.daysRemaining < 0).length,
      dueSoon: items.filter(p => p.daysRemaining >= 0 && p.daysRemaining <= 30).length,
    },
  }
}

export interface CreatePmsPlanInput {
  technicalFileId: number
  planType: PmsPlanType
  nextDue: string
  deviceRef?: string | null
  status?: PmsPlanStatus
  confidence?: number | null
}

export interface UpdatePmsPlanInput {
  planType?: PmsPlanType
  nextDue?: string
  deviceRef?: string | null
  status?: PmsPlanStatus
  confidence?: number | null
}

/** Add a post-market plan to a technical file (FR-PMS-2). */
export function createPmsPlan(db: Db, input: CreatePmsPlanInput): PmsPlan {
  const [plan] = db.insert(pmsPlans).values({
    technicalFileId: input.technicalFileId,
    planType: input.planType,
    deviceRef: input.deviceRef ?? null,
    nextDue: input.nextDue,
    status: input.status ?? 'pending_review',
    confidence: input.confidence ?? null,
    updatedAt: new Date().toISOString(),
  }).returning().all()
  if (!plan) throw createError({ statusCode: 500, statusMessage: 'Failed to create post-market plan' })
  return plan
}

/** Update a post-market plan (FR-PMS-2). */
export function updatePmsPlan(db: Db, id: number, input: UpdatePmsPlanInput): PmsPlan {
  const [existing] = db.select().from(pmsPlans).where(eq(pmsPlans.id, id)).all()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Post-market plan not found' })

  const [plan] = db.update(pmsPlans)
    .set({ ...definedFields(input), updatedAt: new Date().toISOString() })
    .where(eq(pmsPlans.id, id)).returning().all()
  if (!plan) throw createError({ statusCode: 500, statusMessage: 'Failed to update post-market plan' })
  return plan
}

/** Delete a post-market plan. Returns its type/id for the audit trail. */
export function deletePmsPlan(db: Db, id: number): { id: number, planType: PmsPlanType } {
  const [existing] = db.select().from(pmsPlans).where(eq(pmsPlans.id, id)).all()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Post-market plan not found' })

  db.delete(pmsPlans).where(eq(pmsPlans.id, id)).run()
  return { id, planType: existing.planType }
}
