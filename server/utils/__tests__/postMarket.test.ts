import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { seedDatabase } from '../../database/seed'
import { createTechnicalFile } from '../technicalFiles'
import {
  createPmsPlan,
  updatePmsPlan,
  deletePmsPlan,
  getPostMarketOverview,
} from '../postMarket'

const stubHash = async (p: string) => `stub:${p}`

async function freshFile() {
  const db = createDb(':memory:')
  await seedDatabase(db, { hashPassword: stubHash })
  const file = createTechnicalFile(db, { deviceName: 'PMS Test', regulation: 'IVDR' }, 1)
  return { db, file }
}

describe('Post-market plan CRUD (FR-PMS-2)', () => {
  it('creates, updates, and deletes plans and reflects them in the overview', async () => {
    const { db, file } = await freshFile()
    const before = getPostMarketOverview(db).summary

    const plan = createPmsPlan(db, { technicalFileId: file.id, planType: 'PSUR', nextDue: '2027-01-01' })
    expect(plan.status).toBe('pending_review')
    const after = getPostMarketOverview(db).summary
    expect(after.total).toBe(before.total + 1)
    expect(after.byType.PSUR).toBe(before.byType.PSUR + 1)

    const updated = updatePmsPlan(db, plan.id, { status: 'active', confidence: 77 })
    expect(updated.status).toBe('active')
    expect(updated.confidence).toBe(77)

    deletePmsPlan(db, plan.id)
    expect(getPostMarketOverview(db).summary.total).toBe(before.total)
  })

  it('falls back to the file device name when deviceRef is null', async () => {
    const { db, file } = await freshFile()
    const plan = createPmsPlan(db, { technicalFileId: file.id, planType: 'PMCF', nextDue: '2027-06-01' })
    const item = getPostMarketOverview(db).items.find(p => p.id === plan.id)
    expect(item?.deviceName).toBe('PMS Test')
  })

  it('throws for missing plans', async () => {
    const { db } = await freshFile()
    expect(() => updatePmsPlan(db, 9999, { status: 'active' })).toThrow()
    expect(() => deletePmsPlan(db, 9999)).toThrow()
  })
})
