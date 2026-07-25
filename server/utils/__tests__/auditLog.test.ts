import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { seedDatabase } from '../../database/seed'
import { writeAuditLog, getAuditLogView } from '../auditLog'

const stubHash = async (p: string) => `stub:${p}`

async function seededDb() {
  const db = createDb(':memory:')
  await seedDatabase(db, { hashPassword: stubHash })
  return db
}

describe('audit log (FR-LOG-1/2)', () => {
  it('lists seeded entries newest-first with KPIs over the whole log', async () => {
    const view = getAuditLogView(await seededDb())
    expect(view.items).toHaveLength(8)
    expect(view.kpis.total).toBe(8)
    expect(view.kpis.aiActions).toBe(2)
    expect(Date.parse(view.items[0]!.createdAt))
      .toBeGreaterThanOrEqual(Date.parse(view.items.at(-1)!.createdAt))
  })

  it('writeAuditLog appends an entry that surfaces in the view', async () => {
    const db = await seededDb()
    writeAuditLog(db, {
      actorType: 'user', actorName: 'Tester', action: 'Added risk entry',
      impact: 'medium', entityType: 'risk_entries', entityRef: 'RISK-999',
    })
    const view = getAuditLogView(db)
    expect(view.items).toHaveLength(9)
    expect(view.items.some(i => i.entityRef === 'RISK-999')).toBe(true)
  })

  it('filters items but keeps KPIs over the full log', async () => {
    const db = await seededDb()
    const userOnly = getAuditLogView(db, { actorType: 'user' })
    expect(userOnly.items.every(i => i.actorType === 'user')).toBe(true)
    expect(userOnly.kpis.total).toBe(8)
    expect(getAuditLogView(db, { search: 'RISK-014' }).items.length).toBeGreaterThan(0)
  })
})
