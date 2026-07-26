import { describe, it, expect } from 'vitest'
import { computeChangeImpact, buildTraceabilityReportMarkdown, nodeTone } from '../traceability'
import type { TraceabilityGraph, TraceNode } from '#shared/types/traceability'

const graph: TraceabilityGraph = {
  technicalFileId: 1,
  deviceName: 'TestDevice',
  generatedAt: '2026-07-27T00:00:00.000Z',
  nodes: [
    { id: 'gspr:G1', kind: 'gspr', ref: 'G1', label: 'Requirement G1', status: 'conforming' },
    { id: 'risk:R1', kind: 'risk', ref: 'R1', label: 'Hazard R1', status: 'critical' },
    { id: 'test:V1', kind: 'test', ref: 'V1', label: 'Verification', status: null },
    { id: 'standard:S1', kind: 'standard', ref: 'S1', label: 'Standard', status: null },
  ],
  links: [
    { source: 'risk:R1', target: 'gspr:G1', relation: 'traces-to' },
    { source: 'risk:R1', target: 'test:V1', relation: 'verified-by' },
    { source: 'gspr:G1', target: 'standard:S1', relation: 'conforms-to' },
  ],
  matrix: {
    rows: [{ id: 'gspr:G1', kind: 'gspr', ref: 'G1', label: 'Requirement G1', status: 'conforming' }],
    cols: [{ id: 'risk:R1', kind: 'risk', ref: 'R1', label: 'Hazard R1', status: 'critical' }],
    cells: [[true]],
  },
  gaps: [],
  summary: {
    nodeCount: 4, linkCount: 3, gsprTotal: 1, gsprTraced: 1,
    coveragePercent: 100, riskTotal: 1, riskTraced: 1, gapCount: 0,
  },
}

describe('computeChangeImpact', () => {
  it('walks the graph breadth-first, nearest first, then by kind', () => {
    const impact = computeChangeImpact(graph, 'gspr:G1')
    expect(impact).not.toBeNull()
    expect(impact!.impacted.map(i => `${i.ref}@${i.distance}`)).toEqual(['R1@1', 'S1@1', 'V1@2'])
  })

  it('traverses transitively from a leaf node', () => {
    const impact = computeChangeImpact(graph, 'standard:S1')
    expect(impact!.impacted.map(i => `${i.ref}@${i.distance}`)).toEqual(['G1@1', 'R1@2', 'V1@3'])
  })

  it('returns null for a node that is not in the graph', () => {
    expect(computeChangeImpact(graph, 'gspr:missing')).toBeNull()
  })
})

describe('nodeTone', () => {
  it('tones GSPR by conformity, risk by severity, and defaults to draft', () => {
    expect(nodeTone(graph.nodes[0]!)).toBe('approved')
    expect(nodeTone(graph.nodes[1]!)).toBe('deficiency')
    expect(nodeTone(graph.nodes[2]!)).toBe('draft')
  })
})

describe('buildTraceabilityReportMarkdown', () => {
  const md = buildTraceabilityReportMarkdown(graph)

  it('renders the header, coverage summary and matrix table', () => {
    expect(md).toContain('# Traceability Matrix — TestDevice')
    expect(md).toContain('GSPR coverage: 100% (1/1 requirements traced)')
    expect(md).toContain('| GSPR \\ Risk | R1 |')
    expect(md).toContain('| G1 | X |')
  })

  it('reports no gaps when there are none', () => {
    expect(md).toContain('No open traceability gaps.')
  })

  it('lists gaps when present', () => {
    const withGap: TraceabilityGraph = {
      ...graph,
      gaps: [{ nodeId: 'gspr:G2', ref: 'G2', kind: 'gspr', reason: 'G2 is not traced to any risk control or evidence.' }],
    }
    expect(buildTraceabilityReportMarkdown(withGap)).toContain('- **G2** — G2 is not traced')
  })
})

// Type-only guard: ensure TraceNode is the shape the helpers expect.
const _typeCheck: TraceNode = graph.nodes[0]!
void _typeCheck
