import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { seedDatabase } from '../../database/seed'
import { getRiskRegister } from '../riskRegister'
import { getClinicalOverview } from '../clinical'
import { getPostMarketOverview } from '../postMarket'

const stubHash = async (p: string) => `stub:${p}`

async function seededDb() {
  const db = createDb(':memory:')
  await seedDatabase(db, { hashPassword: stubHash })
  return db
}

describe('getRiskRegister (FR-RISK-2)', () => {
  it('joins device names, sorts most-severe first, and summarizes', async () => {
    const { items, summary } = getRiskRegister(await seededDb())
    expect(summary.total).toBe(9)
    expect(summary.unmitigated).toBe(6)
    expect(items[0]!.severity).toBe('critical')
    expect(items.every(i => i.deviceName.length > 0)).toBe(true)
  })
})

describe('getClinicalOverview (FR-CER-1)', () => {
  it('summarizes evidence and ranks AI suggestions by confidence', async () => {
    const { items, summary, aiSuggestions } = getClinicalOverview(await seededDb())
    expect(summary.total).toBe(3)
    expect(summary.approved).toBe(2)
    expect(summary.inReview).toBe(1)
    expect(summary.avgConfidence).toBe(93)
    expect(aiSuggestions).toHaveLength(3)
    expect(aiSuggestions[0]!.confidence).toBe(96)
    expect(items.every(i => i.deviceName.length > 0)).toBe(true)
  })
})

describe('getPostMarketOverview (FR-PMS-1)', () => {
  it('sorts plans soonest-due first with type counts', async () => {
    const { items, summary } = getPostMarketOverview(await seededDb())
    expect(summary.total).toBe(3)
    expect(summary.byType.PSUR).toBe(2)
    expect(summary.byType.PMCF).toBe(1)
    expect(items[0]!.daysRemaining).toBeLessThanOrEqual(items[1]!.daysRemaining)
    expect(summary.dueSoon).toBeGreaterThanOrEqual(1)
  })
})
