import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { seedDatabase } from '../../database/seed'
import { createTechnicalFile, getTechnicalFileDetail } from '../technicalFiles'
import { createRisk, updateRisk, deleteRisk } from '../risk'

const stubHash = async (p: string) => `stub:${p}`

async function freshFile() {
  const db = createDb(':memory:')
  await seedDatabase(db, { hashPassword: stubHash })
  const file = createTechnicalFile(db, { deviceName: 'Risk Test', regulation: 'MDR' }, 1)
  return { db, file }
}

describe('Risk register CRUD (FR-RISK-1)', () => {
  it('creates, updates, and deletes risk entries on a file', async () => {
    const { db, file } = await freshFile()

    const risk = createRisk(db, { technicalFileId: file.id, riskId: 'RISK-900', hazardDescription: 'Overheating', severity: 'major' })
    expect(risk.status).toBe('draft')
    expect(getTechnicalFileDetail(db, file.id).risks).toHaveLength(1)

    const updated = updateRisk(db, risk.id, { status: 'mitigated', mitigation: 'Added redundant fuse' })
    expect(updated.status).toBe('mitigated')
    expect(updated.mitigation).toBe('Added redundant fuse')

    deleteRisk(db, risk.id)
    expect(getTechnicalFileDetail(db, file.id).risks).toHaveLength(0)
  })

  it('throws for missing entries', async () => {
    const { db } = await freshFile()
    expect(() => updateRisk(db, 9999, { severity: 'minor' })).toThrow()
    expect(() => deleteRisk(db, 9999)).toThrow()
  })
})
