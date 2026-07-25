import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { seedDatabase } from '../../database/seed'
import {
  computeReadiness,
  listTechnicalFiles,
  getTechnicalFileDetail,
  createTechnicalFile,
  updateTechnicalFile,
} from '../technicalFiles'

const stubHash = async (p: string) => `stub:${p}`

async function seededDb() {
  const db = createDb(':memory:')
  await seedDatabase(db, { hashPassword: stubHash })
  return db
}

describe('computeReadiness', () => {
  it('is the mean conformity score, 0 when empty', () => {
    expect(computeReadiness([])).toBe(0)
    expect(computeReadiness([{ conformity: 'conforming' as const }, { conformity: 'conforming' as const }])).toBe(100)
    expect(computeReadiness([{ conformity: 'conforming' as const }, { conformity: 'partial' as const }, { conformity: 'missing' as const }])).toBe(50)
    expect(computeReadiness([{ conformity: 'partial' as const }])).toBe(50)
  })
})

describe('listTechnicalFiles', () => {
  it('returns all seeded files with pagination metadata', async () => {
    const result = listTechnicalFiles(await seededDb())
    expect(result.total).toBe(5)
    expect(result.items).toHaveLength(5)
    expect(result.page).toBe(1)
  })

  it('filters by status, regulation, and (case-insensitive) search', async () => {
    const db = await seededDb()
    expect(listTechnicalFiles(db, { status: 'approved' }).total).toBe(1)
    expect(listTechnicalFiles(db, { regulation: 'IVDR' }).total).toBe(1)
    expect(listTechnicalFiles(db, { search: 'ortho' }).total).toBe(2)
  })

  it('paginates', async () => {
    const db = await seededDb()
    expect(listTechnicalFiles(db, { pageSize: 2, page: 1 }).items).toHaveLength(2)
    expect(listTechnicalFiles(db, { pageSize: 2, page: 3 }).items).toHaveLength(1)
  })
})

describe('getTechnicalFileDetail', () => {
  it('includes the gspr matrix and risk register', async () => {
    const db = await seededDb()
    const first = listTechnicalFiles(db).items[0]
    const detail = getTechnicalFileDetail(db, first!.id)
    expect(detail.id).toBe(first!.id)
    expect(Array.isArray(detail.gspr)).toBe(true)
    expect(Array.isArray(detail.risks)).toBe(true)
  })

  it('throws for a missing file', async () => {
    expect(() => getTechnicalFileDetail(createDb(':memory:'), 9999)).toThrow()
  })
})

describe('createTechnicalFile / updateTechnicalFile', () => {
  it('creates a draft file at 0% readiness and updates metadata', async () => {
    const db = await seededDb()
    const created = createTechnicalFile(db, { deviceName: 'Test Device', regulation: 'MDR' }, 1)
    expect(created.status).toBe('draft')
    expect(created.readinessPercent).toBe(0)
    expect(listTechnicalFiles(db).total).toBe(6)

    const updated = updateTechnicalFile(db, created.id, { deviceName: 'Renamed', status: 'in_review' })
    expect(updated.deviceName).toBe('Renamed')
    expect(updated.status).toBe('in_review')
  })

  it('throws updating a missing file', async () => {
    expect(() => updateTechnicalFile(createDb(':memory:'), 9999, { deviceName: 'x' })).toThrow()
  })
})
