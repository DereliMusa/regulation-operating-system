import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { seedDatabase } from '../../database/seed'
import { listTechnicalFiles, getTechnicalFileDetail } from '../technicalFiles'
import { runAuditorSimulation } from '../auditorRules'
import type { AuditorSimulationResult } from '#shared/types/auditor'

const stubHash = async (p: string) => `stub:${p}`

/** Run the simulation against a seeded file, looked up by device name. */
async function simulateSeeded(deviceName: string): Promise<AuditorSimulationResult> {
  const db = createDb(':memory:')
  await seedDatabase(db, { hashPassword: stubHash })
  const file = listTechnicalFiles(db).items.find(f => f.deviceName === deviceName)
  if (!file) throw new Error(`seed file not found: ${deviceName}`)
  const detail = getTechnicalFileDetail(db, file.id)
  return runAuditorSimulation({
    technicalFileId: detail.id,
    deviceName: detail.deviceName,
    regulation: detail.regulation,
    readinessPercent: detail.readinessPercent,
    gspr: detail.gspr,
    risks: detail.risks,
  })
}

describe('runAuditorSimulation over seeded state (FR-AUD-1)', () => {
  it('passes a fully conforming, mitigated file with no findings', async () => {
    const result = await simulateSeeded('CardioGuard Pro S2')
    expect(result.passed).toBe(true)
    expect(result.findings).toHaveLength(0)
    expect(result.summary.total).toBe(0)
  })

  it('raises critical + major findings on a deficient file, most-severe first', async () => {
    const result = await simulateSeeded('GlucoCheck IVD Assay')
    // GSPR: 17.1 missing + 20.1 missing (critical) and GSPR 1 partial (major);
    // RISK-021 critical/draft (critical) + RISK-022 major/draft (major);
    // readiness 42% < 70% (major portfolio finding).
    expect(result.passed).toBe(false)
    expect(result.summary.critical).toBe(3)
    expect(result.summary.major).toBe(3)
    expect(result.summary.total).toBe(6)
    expect(result.findings[0]!.severity).toBe('critical')
    expect(result.findings.every(f => f.description && f.recommendation)).toBe(true)
    expect(result.findings.some(f => f.reference === 'GSPR 17.1')).toBe(true)
    expect(result.findings.some(f => f.reference === 'RISK-021')).toBe(true)
  })

  it('flags a mitigated risk with no verification reference as minor', async () => {
    const result = await simulateSeeded('OrthoFix Pro')
    const minor = result.findings.find(f => f.reference === 'RISK-040')
    expect(minor?.severity).toBe('minor')
    expect(result.findings.some(f => f.reference === 'GSPR 14' && f.severity === 'major')).toBe(true)
  })
})

describe('runAuditorSimulation edge cases', () => {
  it('flags an empty file: no GSPR matrix (critical) and no risk register (major)', () => {
    const result = runAuditorSimulation({
      technicalFileId: 1, deviceName: 'Empty', regulation: 'MDR',
      readinessPercent: 0, gspr: [], risks: [],
    })
    expect(result.passed).toBe(false)
    expect(result.summary.critical).toBe(1)
    expect(result.summary.major).toBe(2) // no risk register + readiness below threshold
    expect(result.findings[0]!.severity).toBe('critical')
  })
})
