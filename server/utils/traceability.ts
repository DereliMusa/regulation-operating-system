// Traceability graph builder (FR-TRC-2). Derives the cross-artifact link graph
// (GSPR <-> risk <-> test <-> clinical, plus standards) for one technical file
// from the existing reference fields. Pure and free of DB/Nuxt dependencies so it
// is unit-testable, and behind a stable interface so a later increment can back it
// with relational link tables without changing callers (ADR-008, mirroring the
// auditorRules seam in ADR-005).
import type { GsprEntry } from '#shared/types/gspr'
import type { RiskEntry } from '#shared/types/risk'
import type { ClinicalEvidence } from '#shared/types/clinical'
import type {
  TraceNode,
  TraceLink,
  TraceNodeKind,
  TraceRelation,
  TraceMatrix,
  CoverageGap,
  TraceabilityGraph,
} from '#shared/types/traceability'

/** A technical file reduced to what the graph builder needs. */
export interface TraceabilityInput {
  technicalFileId: number
  deviceName: string
  gspr: GsprEntry[]
  risks: RiskEntry[]
  clinical: ClinicalEvidence[]
}

const nodeId = (kind: TraceNodeKind, ref: string): string => `${kind}:${ref}`

/** Human label for a verification/control/evidence ("test" bucket) reference. */
function testLabel(ref: string): string {
  if (/^V&V/i.test(ref)) return 'Verification & validation'
  if (/^RCM/i.test(ref)) return 'Risk control measure'
  return 'Evidence'
}

/** Accumulates de-duplicated nodes and links while the builder walks the entities. */
class GraphBuilder {
  private nodes = new Map<string, TraceNode>()
  private links = new Map<string, TraceLink>()

  addNode(kind: TraceNodeKind, ref: string, label: string, status: string | null = null): string {
    const id = nodeId(kind, ref)
    if (!this.nodes.has(id)) this.nodes.set(id, { id, kind, ref, label, status })
    return id
  }

  hasNode(kind: TraceNodeKind, ref: string): boolean {
    return this.nodes.has(nodeId(kind, ref))
  }

  addLink(source: string, target: string, relation: TraceRelation): void {
    this.links.set(`${source}>${target}:${relation}`, { source, target, relation })
  }

  nodeList(): TraceNode[] { return [...this.nodes.values()] }
  linkList(): TraceLink[] { return [...this.links.values()] }
}

/**
 * Build the traceability graph for one technical file: nodes for every GSPR, risk,
 * clinical evidence record, referenced standard, and verification/control artifact,
 * with links derived from the reference fields (risk.traceabilityRefs -> GSPR,
 * risk.verificationRef/controlMeasureRef -> test, gspr.standardRefs -> standard,
 * gspr.evidenceRefs -> clinical/test).
 *
 * @param input - the technical file plus its GSPR, risk and clinical entities
 * @returns the nodes, links, GSPR x risk matrix, coverage gaps and a summary
 */
export function buildTraceabilityGraph(input: TraceabilityInput): TraceabilityGraph {
  const b = new GraphBuilder()
  const gsprRefs = new Set(input.gspr.map(g => g.gsprRef))
  const clinicalRefs = new Set(input.clinical.map(c => c.cerRef))

  for (const g of input.gspr) b.addNode('gspr', g.gsprRef, g.requirementText, g.conformity)
  for (const r of input.risks) b.addNode('risk', r.riskId, r.hazardDescription, r.severity)
  for (const c of input.clinical) b.addNode('clinical', c.cerRef, c.title, c.status)

  for (const r of input.risks) {
    const risk = nodeId('risk', r.riskId)
    for (const ref of r.traceabilityRefs) {
      if (gsprRefs.has(ref)) b.addLink(risk, nodeId('gspr', ref), 'traces-to')
    }
    if (r.verificationRef) b.addLink(risk, b.addNode('test', r.verificationRef, testLabel(r.verificationRef)), 'verified-by')
    if (r.controlMeasureRef) b.addLink(risk, b.addNode('test', r.controlMeasureRef, testLabel(r.controlMeasureRef)), 'controlled-by')
  }

  for (const g of input.gspr) {
    const gspr = nodeId('gspr', g.gsprRef)
    for (const ref of g.standardRefs) b.addLink(gspr, b.addNode('standard', ref, 'Harmonised standard'), 'conforms-to')
    for (const ref of g.evidenceRefs) {
      if (clinicalRefs.has(ref)) b.addLink(gspr, nodeId('clinical', ref), 'evidenced-by')
      else b.addLink(gspr, b.addNode('test', ref, testLabel(ref)), 'evidenced-by')
    }
  }

  const nodes = b.nodeList()
  const links = b.linkList()
  return {
    technicalFileId: input.technicalFileId,
    deviceName: input.deviceName,
    generatedAt: new Date().toISOString(),
    nodes,
    links,
    matrix: buildMatrix(nodes, links),
    gaps: findGaps(nodes, links),
    summary: summarize(nodes, links),
  }
}

/** GSPR (rows) x risk (cols) coverage matrix from the `traces-to` links. */
function buildMatrix(nodes: TraceNode[], links: TraceLink[]): TraceMatrix {
  const rows = nodes.filter(n => n.kind === 'gspr')
  const cols = nodes.filter(n => n.kind === 'risk')
  const traced = new Set(
    links.filter(l => l.relation === 'traces-to').map(l => `${l.source}|${l.target}`),
  )
  const cells = rows.map(row => cols.map(col => traced.has(`${col.id}|${row.id}`)))
  return { rows, cols, cells }
}

/** Undirected neighbour-kind index: node id -> set of neighbour kinds. */
function neighbourKinds(links: TraceLink[], byId: Map<string, TraceNode>): Map<string, Set<TraceNodeKind>> {
  const index = new Map<string, Set<TraceNodeKind>>()
  const add = (from: string, toKind: TraceNodeKind | undefined): void => {
    if (!toKind) return
    if (!index.has(from)) index.set(from, new Set())
    index.get(from)!.add(toKind)
  }
  for (const l of links) {
    add(l.source, byId.get(l.target)?.kind)
    add(l.target, byId.get(l.source)?.kind)
  }
  return index
}

/** GSPRs with no risk/clinical/test link, and risks not traced to a GSPR. */
function findGaps(nodes: TraceNode[], links: TraceLink[]): CoverageGap[] {
  const byId = new Map(nodes.map(n => [n.id, n]))
  const kinds = neighbourKinds(links, byId)
  const gaps: CoverageGap[] = []
  for (const n of nodes) {
    const near = kinds.get(n.id) ?? new Set<TraceNodeKind>()
    if (n.kind === 'gspr' && !near.has('risk') && !near.has('clinical') && !near.has('test')) {
      gaps.push({ nodeId: n.id, ref: n.ref, kind: n.kind, reason: `${n.ref} is not traced to any risk control or evidence.` })
    }
    else if (n.kind === 'risk' && !near.has('gspr')) {
      gaps.push({ nodeId: n.id, ref: n.ref, kind: n.kind, reason: `${n.ref} is not traced to a GSPR requirement.` })
    }
  }
  return gaps.sort((a, b) => (a.kind === b.kind ? a.ref.localeCompare(b.ref) : a.kind === 'gspr' ? -1 : 1))
}

function summarize(nodes: TraceNode[], links: TraceLink[]): TraceabilityGraph['summary'] {
  const byId = new Map(nodes.map(n => [n.id, n]))
  const kinds = neighbourKinds(links, byId)
  const gspr = nodes.filter(n => n.kind === 'gspr')
  const risks = nodes.filter(n => n.kind === 'risk')
  const isTraced = (id: string, wanted: TraceNodeKind[]): boolean => {
    const near = kinds.get(id)
    return !!near && wanted.some(k => near.has(k))
  }
  const gsprTraced = gspr.filter(g => isTraced(g.id, ['risk', 'clinical', 'test'])).length
  const riskTraced = risks.filter(r => isTraced(r.id, ['gspr'])).length
  const gapCount = gspr.length - gsprTraced + (risks.length - riskTraced)
  return {
    nodeCount: nodes.length,
    linkCount: links.length,
    gsprTotal: gspr.length,
    gsprTraced,
    coveragePercent: gspr.length === 0 ? 0 : Math.round((gsprTraced / gspr.length) * 100),
    riskTotal: risks.length,
    riskTraced,
    gapCount,
  }
}
