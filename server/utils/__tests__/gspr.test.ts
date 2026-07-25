import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { seedDatabase } from '../../database/seed'
import { createTechnicalFile, getTechnicalFileDetail } from '../technicalFiles'
import { createGspr, updateGspr, deleteGspr } from '../gspr'

const stubHash = async (p: string) => `stub:${p}`

async function freshFile() {
  const db = createDb(':memory:')
  await seedDatabase(db, { hashPassword: stubHash })
  const file = createTechnicalFile(db, { deviceName: 'GSPR Test', regulation: 'MDR' }, 1)
  return { db, file }
}

function readiness(db: ReturnType<typeof createDb>, id: number): number {
  return getTechnicalFileDetail(db, id).readinessPercent
}

describe('GSPR CRUD recomputes readiness (FR-TF-4)', () => {
  it('recomputes the parent file readiness on create, update, and delete', async () => {
    const { db, file } = await freshFile()
    expect(readiness(db, file.id)).toBe(0)

    const a = createGspr(db, { technicalFileId: file.id, gsprRef: 'GSPR 1', requirementText: 'x', conformity: 'conforming' })
    expect(readiness(db, file.id)).toBe(100)

    const b = createGspr(db, { technicalFileId: file.id, gsprRef: 'GSPR 2', requirementText: 'y', conformity: 'missing' })
    expect(readiness(db, file.id)).toBe(50)

    updateGspr(db, b.id, { conformity: 'conforming' })
    expect(readiness(db, file.id)).toBe(100)

    deleteGspr(db, a.id)
    expect(readiness(db, file.id)).toBe(100)

    deleteGspr(db, b.id)
    expect(readiness(db, file.id)).toBe(0)
  })

  it('throws for missing entries', async () => {
    const { db } = await freshFile()
    expect(() => updateGspr(db, 9999, { conformity: 'conforming' })).toThrow()
    expect(() => deleteGspr(db, 9999)).toThrow()
  })
})
