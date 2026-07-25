// Post-Market overview (FR-PMS-1): surveillance plans joined to their device
// with days-until-due, soonest first (the milestone timeline), plus a summary.
import type { Db } from './createDb'
import { pmsPlans, technicalFiles } from '../database/schema'
import type { PmsPlanType, PmsPlanItem, PostMarketOverview } from '#shared/types/post-market'

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
