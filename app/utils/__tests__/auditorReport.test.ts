import { describe, it, expect } from 'vitest'
import { buildAuditorReportMarkdown } from '../auditorReport'
import type { AuditorSimulationResult } from '#shared/types/auditor'

const base: AuditorSimulationResult = {
  technicalFileId: 1,
  deviceName: 'GlucoCheck IVD Assay',
  regulation: 'IVDR',
  readinessPercent: 42,
  generatedAt: '2026-07-26T00:00:00.000Z',
  passed: false,
  summary: { total: 1, critical: 1, major: 0, minor: 0 },
  findings: [
    {
      severity: 'critical',
      category: 'gspr',
      reference: 'GSPR 17.1',
      description: 'GSPR 17.1 is marked missing.',
      recommendation: 'Provide evidence for GSPR 17.1.',
    },
  ],
}

describe('buildAuditorReportMarkdown', () => {
  it('renders the header, finding, reference, and recommendation', () => {
    const md = buildAuditorReportMarkdown(base)
    expect(md).toContain('# Auditor Simulation Report — GlucoCheck IVD Assay')
    expect(md).toContain('Regulation: IVDR')
    expect(md).toContain('[CRITICAL] gspr (GSPR 17.1)')
    expect(md).toContain('**Recommendation:** Provide evidence for GSPR 17.1.')
  })

  it('renders a PASS report with no findings', () => {
    const md = buildAuditorReportMarkdown({
      ...base, passed: true, summary: { total: 0, critical: 0, major: 0, minor: 0 }, findings: [],
    })
    expect(md).toContain('PASS — no deficiencies found')
    expect(md).toContain('No findings.')
  })
})
