import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { seedDatabase } from '../../database/seed'
import { getDashboardStats } from '../dashboard'

// The seed test's stub: the dashboard aggregation does not care about hashing.
const stubHashPassword = async (password: string) => `stub:${password}`

describe('getDashboardStats', () => {
  it('aggregates readiness, files, findings, drafts, approvals and deadlines from seed data', async () => {
    const db = createDb(':memory:')
    await seedDatabase(db, { hashPassword: stubHashPassword })

    const stats = getDashboardStats(db)

    // 5 seeded files; overall readiness is their mean (100,78,42,15,88 -> 65).
    expect(stats.counts.files).toBe(5)
    expect(stats.readiness.overallPercent).toBe(65)
    expect(stats.readiness.activeFileCount).toBe(5)

    // Files sorted by readiness, highest first.
    expect(stats.files[0]?.readinessPercent).toBe(100)
    expect(stats.files.at(-1)?.readinessPercent).toBe(15)

    // 4 open findings, critical first, each resolved to a real device name.
    expect(stats.counts.openFindings).toBe(4)
    expect(stats.findings[0]?.severity).toBe('critical')
    expect(stats.findings.every(f => f.deviceName !== 'Unknown device')).toBe(true)

    // 3 confidence-scored AI drafts, highest confidence first.
    expect(stats.counts.aiDrafts).toBe(3)
    expect(stats.aiDrafts[0]?.confidence ?? 0).toBeGreaterThanOrEqual(stats.aiDrafts[1]?.confidence ?? 0)

    // 4 pending approvals (2 files in_review + 1 clinical in_review + 1 pms pending).
    expect(stats.counts.pendingApprovals).toBe(4)

    // 3 post-market deadlines, soonest first.
    expect(stats.deadlines).toHaveLength(3)
    expect(stats.deadlines[0]?.daysRemaining ?? 0).toBeLessThanOrEqual(stats.deadlines[1]?.daysRemaining ?? 0)
  })

  it('returns zeroed aggregates for an empty database', () => {
    const db = createDb(':memory:')
    const stats = getDashboardStats(db)

    expect(stats.readiness.overallPercent).toBe(0)
    expect(stats.counts).toEqual({ files: 0, openFindings: 0, pendingApprovals: 0, aiDrafts: 0 })
    expect(stats.files).toEqual([])
  })
})
