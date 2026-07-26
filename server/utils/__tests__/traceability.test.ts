import { describe, it, expect } from 'vitest'
import { buildTraceabilityGraph, type TraceabilityInput } from '../traceability'
import type { GsprEntry } from '#shared/types/gspr'
import type { RiskEntry } from '#shared/types/risk'
import type { ClinicalEvidence } from '#shared/types/clinical'

function gspr(overrides: Partial<GsprEntry> & Pick<GsprEntry, 'gsprRef'>): GsprEntry {
  return {
    id: 1, technicalFileId: 1, requirementText: `Requirement ${overrides.gsprRef}`,
    conformity: 'conforming', evidenceRefs: [], standardRefs: [], notes: null,
    updatedAt: '2026-01-01T00:00:00.000Z', ...overrides,
  }
}
function risk(overrides: Partial<RiskEntry> & Pick<RiskEntry, 'riskId'>): RiskEntry {
  return {
    id: 1, technicalFileId: 1, hazardDescription: `Hazard ${overrides.riskId}`,
    severity: 'major', probability: 'P2', status: 'review', mitigation: null,
    controlMeasureRef: null, verificationRef: null, traceabilityRefs: [],
    updatedAt: '2026-01-01T00:00:00.000Z', ...overrides,
  }
}
function clinical(cerRef: string): ClinicalEvidence {
  return {
    id: 1, technicalFileId: 1, cerRef, sourceType: 'literature', title: `Study ${cerRef}`,
    status: 'approved', aiSummary: null, confidence: null, updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

const input: TraceabilityInput = {
  technicalFileId: 7,
  deviceName: 'TestDevice',
  gspr: [
    gspr({ gsprRef: 'GSPR 1', conformity: 'conforming', standardRefs: ['ISO 14971'], evidenceRefs: ['CER-1'] }),
    gspr({ gsprRef: 'GSPR 2', conformity: 'partial' }),
  ],
  risks: [
    risk({ riskId: 'RISK-1', severity: 'critical', traceabilityRefs: ['GSPR 1', 'GSPR 99'], verificationRef: 'V&V-1', controlMeasureRef: 'RCM-1' }),
    risk({ riskId: 'RISK-2' }),
  ],
  clinical: [clinical('CER-1')],
}

describe('buildTraceabilityGraph', () => {
  const graph = buildTraceabilityGraph(input)
  const nodeIds = new Set(graph.nodes.map(n => n.id))
  const hasLink = (source: string, target: string, relation: string): boolean =>
    graph.links.some(l => l.source === source && l.target === target && l.relation === relation)

  it('creates a node for every artifact kind', () => {
    expect(nodeIds).toEqual(new Set([
      'gspr:GSPR 1', 'gspr:GSPR 2', 'risk:RISK-1', 'risk:RISK-2',
      'clinical:CER-1', 'test:V&V-1', 'test:RCM-1', 'standard:ISO 14971',
    ]))
  })

  it('derives links from the reference fields', () => {
    expect(hasLink('risk:RISK-1', 'gspr:GSPR 1', 'traces-to')).toBe(true)
    expect(hasLink('risk:RISK-1', 'test:V&V-1', 'verified-by')).toBe(true)
    expect(hasLink('risk:RISK-1', 'test:RCM-1', 'controlled-by')).toBe(true)
    expect(hasLink('gspr:GSPR 1', 'standard:ISO 14971', 'conforms-to')).toBe(true)
    expect(hasLink('gspr:GSPR 1', 'clinical:CER-1', 'evidenced-by')).toBe(true)
  })

  it('ignores traceability refs to a GSPR that does not exist', () => {
    expect(nodeIds.has('gspr:GSPR 99')).toBe(false)
    expect(graph.links.some(l => l.target === 'gspr:GSPR 99')).toBe(false)
  })

  it('builds a GSPR x risk coverage matrix', () => {
    expect(graph.matrix.rows.map(r => r.ref)).toEqual(['GSPR 1', 'GSPR 2'])
    expect(graph.matrix.cols.map(c => c.ref)).toEqual(['RISK-1', 'RISK-2'])
    expect(graph.matrix.cells).toEqual([[true, false], [false, false]])
  })

  it('flags GSPRs with no coverage and risks not traced to a requirement', () => {
    expect(graph.gaps.map(g => g.ref)).toEqual(['GSPR 2', 'RISK-2'])
  })

  it('summarizes coverage', () => {
    expect(graph.summary).toMatchObject({
      gsprTotal: 2, gsprTraced: 1, coveragePercent: 50,
      riskTotal: 2, riskTraced: 1, gapCount: 2, linkCount: 5, nodeCount: 8,
    })
  })

  it('handles a file with no GSPR or risk entries', () => {
    const empty = buildTraceabilityGraph({ technicalFileId: 1, deviceName: 'Empty', gspr: [], risks: [], clinical: [] })
    expect(empty.matrix.cells).toEqual([])
    expect(empty.summary.coveragePercent).toBe(0)
    expect(empty.gaps).toEqual([])
  })
})
