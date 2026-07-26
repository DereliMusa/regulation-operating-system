// Cross-artifact traceability graph for one technical file (FR-TRC-2).
// The graph is derived from the existing reference fields (risk.traceabilityRefs,
// gspr.standardRefs/evidenceRefs, risk.verificationRef/controlMeasureRef) by a
// pure builder (server/utils/traceability.ts). It is the stable interface a later
// increment's relational link tables will back without changing consumers
// (see SDLC/01-architecture/adr/008-derived-traceability-graph.md).

/** The artifact kinds that participate in the GSPR <-> risk <-> test <-> clinical chain. */
export type TraceNodeKind = 'gspr' | 'risk' | 'test' | 'clinical' | 'standard'

/** How two artifacts relate; used for edge labels and impact explanations. */
export type TraceRelation = 'traces-to' | 'verified-by' | 'controlled-by' | 'conforms-to' | 'evidenced-by'

/** A single artifact node. `id` is unique across kinds (`${kind}:${ref}`). */
export interface TraceNode {
  id: string
  kind: TraceNodeKind
  /** Display reference, e.g. "GSPR 17.1", "RISK-014", "V&V-201", "ISO 14971". */
  ref: string
  /** Short human label (requirement text / hazard / evidence title). */
  label: string
  /** Optional status/conformity/severity used for tone in the UI. */
  status: string | null
}

/** An undirected relationship between two nodes; `source`/`target` carry the natural reading direction. */
export interface TraceLink {
  source: string
  target: string
  relation: TraceRelation
}

/** GSPR (rows) x Risk (cols) coverage matrix — the classic regulatory traceability view. */
export interface TraceMatrix {
  rows: TraceNode[]
  cols: TraceNode[]
  /** `cells[r][c]` is true when row GSPR is traced to by col risk. */
  cells: boolean[][]
}

/** A traceability gap: an artifact with no cross-links to the rest of the chain. */
export interface CoverageGap {
  nodeId: string
  ref: string
  kind: TraceNodeKind
  reason: string
}

export interface TraceabilitySummary {
  nodeCount: number
  linkCount: number
  gsprTotal: number
  gsprTraced: number
  /** Share of GSPRs traced to at least one risk or evidence node (0-100). */
  coveragePercent: number
  riskTotal: number
  riskTraced: number
  gapCount: number
}

/** Full traceability payload for one technical file (GET /api/technical-files/:id/traceability). */
export interface TraceabilityGraph {
  technicalFileId: number
  deviceName: string
  generatedAt: string
  nodes: TraceNode[]
  links: TraceLink[]
  matrix: TraceMatrix
  gaps: CoverageGap[]
  summary: TraceabilitySummary
}

/** One artifact reachable from a changed node, with its graph distance. */
export interface ImpactedNode {
  nodeId: string
  ref: string
  kind: TraceNodeKind
  label: string
  /** Hops from the changed node (1 = directly linked). */
  distance: number
}

/** Change-impact result: everything transitively linked to a changed artifact. */
export interface ChangeImpact {
  nodeId: string
  ref: string
  kind: TraceNodeKind
  impacted: ImpactedNode[]
}
