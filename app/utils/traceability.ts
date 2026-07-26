// Client-side traceability helpers (FR-TRC-2): change-impact analysis over a
// fetched graph, display metadata, and a Markdown export. Pure so it is
// unit-testable; the browser download itself lives in the component (mirroring
// auditorReport.ts). The graph is built server-side (server/utils/traceability.ts).
import type {
  TraceabilityGraph,
  TraceNode,
  TraceNodeKind,
  TraceRelation,
  ChangeImpact,
  ImpactedNode,
} from '#shared/types/traceability'
import { statusTone, severityTone, type BadgeTone } from './badges'

const KIND_RANK: Record<TraceNodeKind, number> = { gspr: 0, risk: 1, test: 2, clinical: 3, standard: 4 }

/** Display metadata per node kind (legend, chips, matrix headers). */
export const KIND_META: Record<TraceNodeKind, { label: string, icon: string }> = {
  gspr: { label: 'GSPR', icon: 'i-material-symbols-checklist' },
  risk: { label: 'Risk', icon: 'i-material-symbols-warning-outline' },
  test: { label: 'Test / evidence', icon: 'i-material-symbols-science-outline' },
  clinical: { label: 'Clinical', icon: 'i-material-symbols-clinical-notes-outline' },
  standard: { label: 'Standard', icon: 'i-material-symbols-book-2-outline' },
}

/** Human phrasing for a relation, read source -> target. */
export const RELATION_LABEL: Record<TraceRelation, string> = {
  'traces-to': 'traces to',
  'verified-by': 'verified by',
  'controlled-by': 'controlled by',
  'conforms-to': 'conforms to',
  'evidenced-by': 'evidenced by',
}

/** Badge tone for a node from its status/conformity/severity (neutral when none). */
export function nodeTone(node: TraceNode): BadgeTone {
  if (!node.status) return 'draft'
  return node.kind === 'risk' ? severityTone(node.status) : statusTone(node.status)
}

/**
 * Everything transitively linked to a changed artifact: a breadth-first walk of
 * the (undirected) graph from `startId`, returning each reachable node with its
 * hop distance (1 = directly linked), nearest first (FR-TRC-2 change impact).
 *
 * @param graph - the traceability graph to traverse
 * @param startId - the node id whose change is being assessed
 * @returns the impact result, or null when the node is not in the graph
 */
export function computeChangeImpact(graph: TraceabilityGraph, startId: string): ChangeImpact | null {
  const byId = new Map(graph.nodes.map(n => [n.id, n]))
  const start = byId.get(startId)
  if (!start) return null

  const adjacency = new Map<string, Set<string>>()
  const connect = (a: string, b: string): void => {
    if (!adjacency.has(a)) adjacency.set(a, new Set())
    adjacency.get(a)!.add(b)
  }
  for (const l of graph.links) { connect(l.source, l.target); connect(l.target, l.source) }

  const distance = new Map<string, number>([[startId, 0]])
  const queue: string[] = [startId]
  const impacted: ImpactedNode[] = []
  while (queue.length) {
    const current = queue.shift()!
    const hop = distance.get(current)! + 1
    for (const next of adjacency.get(current) ?? []) {
      if (distance.has(next)) continue
      distance.set(next, hop)
      queue.push(next)
      const node = byId.get(next)
      if (node) impacted.push({ nodeId: node.id, ref: node.ref, kind: node.kind, label: node.label, distance: hop })
    }
  }
  impacted.sort((a, b) => a.distance - b.distance || KIND_RANK[a.kind] - KIND_RANK[b.kind] || a.ref.localeCompare(b.ref))
  return { nodeId: start.id, ref: start.ref, kind: start.kind, impacted }
}

/** Render the GSPR x risk matrix as a plain-Markdown table (X = traced). */
function matrixTable(graph: TraceabilityGraph): string[] {
  const { rows, cols, cells } = graph.matrix
  if (rows.length === 0) return ['No GSPR requirements to map.']
  if (cols.length === 0) return ['No risks to map against requirements.']
  const header = `| GSPR \\ Risk | ${cols.map(c => c.ref).join(' | ')} |`
  const divider = `| --- | ${cols.map(() => '---').join(' | ')} |`
  const body = rows.map((row, r) => `| ${row.ref} | ${cells[r]!.map(v => (v ? 'X' : '-')).join(' | ')} |`)
  return [header, divider, ...body]
}

/**
 * Render a traceability graph as a plain-Markdown report for download (FR-TRC-2):
 * a coverage summary, the GSPR x risk matrix, and the open traceability gaps.
 * Pure so it is unit-testable.
 *
 * @param graph - a built traceability graph
 * @returns the report as a Markdown string
 */
export function buildTraceabilityReportMarkdown(graph: TraceabilityGraph): string {
  const s = graph.summary
  const lines: string[] = [
    `# Traceability Matrix — ${graph.deviceName}`,
    '',
    `- Generated: ${graph.generatedAt}`,
    `- GSPR coverage: ${s.coveragePercent}% (${s.gsprTraced}/${s.gsprTotal} requirements traced)`,
    `- Risks traced to a requirement: ${s.riskTraced}/${s.riskTotal}`,
    `- Nodes: ${s.nodeCount}, Links: ${s.linkCount}, Open gaps: ${s.gapCount}`,
    '',
    '> Derived traceability view. Not a regulatory determination.',
    '',
    '## Coverage matrix (GSPR x Risk)',
    '',
    ...matrixTable(graph),
    '',
    '## Traceability gaps',
    '',
  ]
  if (graph.gaps.length === 0) lines.push('No open traceability gaps.')
  else graph.gaps.forEach(g => lines.push(`- **${g.ref}** — ${g.reason}`))
  return lines.join('\n')
}
