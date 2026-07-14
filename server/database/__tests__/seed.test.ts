import { describe, it, expect } from 'vitest'
import { sql } from 'drizzle-orm'
import { createDb } from '../../utils/createDb'
import { seedDatabase } from '../seed'
import { users, technicalFiles, gsprEntries, riskEntries, auditLog } from '../schema'

// Trivial stub: the seed test only verifies that rows are populated
// correctly, not that hashing is cryptographically sound (that is covered
// by the auth tests once nuxt-auth-utils' hashPassword is wired in S2).
const stubHashPassword = async (password: string) => `stub:${password}`

describe('seedDatabase', () => {
  it('populates the schema with referentially consistent demo data', async () => {
    const db = createDb(':memory:')

    await seedDatabase(db, { hashPassword: stubHashPassword })

    const seededUsers = db.select().from(users).all()
    const seededFiles = db.select().from(technicalFiles).all()
    const seededGspr = db.select().from(gsprEntries).all()
    const seededRisks = db.select().from(riskEntries).all()
    const seededAuditLog = db.select().from(auditLog).all()

    expect(seededUsers).toHaveLength(1)
    expect(seededUsers[0].passwordHash).toBe('stub:CertraDemo!2026')
    expect(seededFiles.length).toBeGreaterThanOrEqual(5)
    expect(seededGspr.length).toBeGreaterThan(0)
    expect(seededRisks.length).toBeGreaterThan(0)
    expect(seededAuditLog.length).toBeGreaterThan(0)

    const fileIds = new Set(seededFiles.map((file) => file.id))
    for (const entry of seededGspr) {
      expect(fileIds.has(entry.technicalFileId)).toBe(true)
    }
    for (const entry of seededRisks) {
      expect(fileIds.has(entry.technicalFileId)).toBe(true)
    }
  })

  it('creates the expected table set via migrations', () => {
    const db = createDb(':memory:')
    const tables = db.all<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle%'`,
    )
    const tableNames = tables.map((table) => table.name).sort()

    expect(tableNames).toEqual([
      'audit_log',
      'auditor_findings',
      'clinical_evidence',
      'demo_requests',
      'gspr_entries',
      'pms_plans',
      'risk_entries',
      'technical_files',
      'users',
    ])
  })
})
