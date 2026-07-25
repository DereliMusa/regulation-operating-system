import type { Regulation } from './technical-file'

export type FindingSeverity = 'critical' | 'major' | 'minor'
export type FindingStatus = 'open' | 'resolved'

export interface AuditorFinding {
  id: number
  technicalFileId: number
  severity: FindingSeverity
  gsprRef: string | null
  description: string
  recommendation: string | null
  status: FindingStatus
  createdAt: string
  resolvedAt: string | null
}

// --- Auditor Simulation (FR-AUD-1/2) ---
// The simulation produces findings live from a file's current GSPR/risk state.
// These are ephemeral (computed on each run), distinct from the persisted
// `AuditorFinding` DB rows above that the dashboard reads.

export type FindingCategory = 'gspr' | 'risk' | 'portfolio'

/** One deficiency surfaced by a simulation run. */
export interface SimulationFinding {
  severity: FindingSeverity
  category: FindingCategory
  /** The related artifact ref (e.g. `GSPR 17.1`, `RISK-021`), or null for file-level findings. */
  reference: string | null
  description: string
  recommendation: string
}

export interface SimulationSummary {
  total: number
  critical: number
  major: number
  minor: number
}

/** Result of running the Auditor Simulation on one technical file. */
export interface AuditorSimulationResult {
  technicalFileId: number
  deviceName: string
  regulation: Regulation
  readinessPercent: number
  /** ISO 8601 timestamp of when the simulation was run. */
  generatedAt: string
  /** True when the run produced no findings. */
  passed: boolean
  summary: SimulationSummary
  /** Findings ordered most-severe first. */
  findings: SimulationFinding[]
}
