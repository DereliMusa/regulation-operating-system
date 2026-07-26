import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { seedDatabase } from '../../database/seed'
import { createTechnicalFile } from '../technicalFiles'
import {
  createClinicalEvidence,
  updateClinicalEvidence,
  deleteClinicalEvidence,
  getClinicalOverview,
} from '../clinical'

const stubHash = async (p: string) => `stub:${p}`

async function freshFile() {
  const db = createDb(':memory:')
  await seedDatabase(db, { hashPassword: stubHash })
  const file = createTechnicalFile(db, { deviceName: 'CER Test', regulation: 'MDR' }, 1)
  return { db, file }
}

describe('Clinical evidence CRUD (FR-CER-2)', () => {
  it('creates, updates, and deletes evidence and reflects it in the overview', async () => {
    const { db, file } = await freshFile()
    const before = getClinicalOverview(db).summary.total

    const entry = createClinicalEvidence(db, {
      technicalFileId: file.id, cerRef: 'CER-900', sourceType: 'literature', title: 'Meta-analysis of outcomes',
    })
    expect(entry.status).toBe('draft')
    expect(getClinicalOverview(db).summary.total).toBe(before + 1)

    const updated = updateClinicalEvidence(db, entry.id, { status: 'approved', confidence: 88 })
    expect(updated.status).toBe('approved')
    expect(updated.confidence).toBe(88)

    deleteClinicalEvidence(db, entry.id)
    expect(getClinicalOverview(db).summary.total).toBe(before)
  })

  it('joins the device name and ranks an AI-summarized record', async () => {
    const { db, file } = await freshFile()
    createClinicalEvidence(db, {
      technicalFileId: file.id, cerRef: 'CER-901', sourceType: 'investigation',
      title: 'PMCF study', aiSummary: 'Favourable benefit-risk profile', confidence: 91,
    })
    const overview = getClinicalOverview(db)
    const item = overview.items.find(i => i.cerRef === 'CER-901')
    expect(item?.deviceName).toBe('CER Test')
    expect(overview.aiSuggestions.some(s => s.cerRef === 'CER-901')).toBe(true)
  })

  it('throws for missing records', async () => {
    const { db } = await freshFile()
    expect(() => updateClinicalEvidence(db, 9999, { status: 'approved' })).toThrow()
    expect(() => deleteClinicalEvidence(db, 9999)).toThrow()
  })
})
