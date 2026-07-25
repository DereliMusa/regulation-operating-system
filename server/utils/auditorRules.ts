// Mock Auditor Simulation rule engine (FR-AUD-1). A deterministic rule set that
// inspects a technical file's GSPR conformity and ISO 14971 risk state and emits
// the deficiencies a Notified Body reviewer would likely raise. Pure and free of
// DB/Nuxt dependencies so it is unit-testable, and behind a stable interface so
// Phase 1 can swap in a Claude-backed analysis without changing callers (ADR-005).
import type { GsprEntry } from '#shared/types/gspr'
import type { RiskEntry } from '#shared/types/risk'
import type { Regulation } from '#shared/types/technical-file'
import type {
  FindingSeverity,
  SimulationFinding,
  SimulationSummary,
  AuditorSimulationResult,
} from '#shared/types/auditor'

/** A technical file reduced to what the rule engine needs to assess it. */
export interface AuditorInput {
  technicalFileId: number
  deviceName: string
  regulation: Regulation
  readinessPercent: number
  gspr: GsprEntry[]
  risks: RiskEntry[]
}

// Below this overall readiness a file is not considered submission-ready.
const READINESS_THRESHOLD = 70
const SEVERITY_RANK: Record<FindingSeverity, number> = { critical: 0, major: 1, minor: 2 }

/** GSPR conformity deficiencies: missing is critical, partial is major. */
function gsprFindings(gspr: GsprEntry[]): SimulationFinding[] {
  if (gspr.length === 0) {
    return [{
      severity: 'critical', category: 'gspr', reference: null,
      description: 'No GSPR matrix has been started for this technical file.',
      recommendation: 'Add the Annex I GSPR requirements and map each to conformity evidence.',
    }]
  }
  const findings: SimulationFinding[] = []
  for (const g of gspr) {
    if (g.conformity === 'missing') {
      findings.push({
        severity: 'critical', category: 'gspr', reference: g.gsprRef,
        description: `${g.gsprRef} is marked missing — no conformity evidence is recorded.`,
        recommendation: `Provide evidence and demonstrate conformity for ${g.gsprRef}.`,
      })
    }
    else if (g.conformity === 'partial') {
      findings.push({
        severity: 'major', category: 'gspr', reference: g.gsprRef,
        description: `${g.gsprRef} is only partially conforming.`,
        recommendation: `Close the outstanding evidence gap to reach full conformity for ${g.gsprRef}.`,
      })
    }
  }
  return findings
}

/** ISO 14971 gaps: unmitigated high-severity risks, and mitigations lacking verification. */
function riskFindings(risks: RiskEntry[]): SimulationFinding[] {
  if (risks.length === 0) {
    return [{
      severity: 'major', category: 'risk', reference: null,
      description: 'No ISO 14971 risk register entries exist for this file.',
      recommendation: 'Identify hazards and document risk controls and verification per ISO 14971.',
    }]
  }
  const findings: SimulationFinding[] = []
  for (const r of risks) {
    const unmitigated = r.status !== 'mitigated'
    if (r.severity === 'critical' && unmitigated) {
      findings.push({
        severity: 'critical', category: 'risk', reference: r.riskId,
        description: `Critical risk ${r.riskId} is not mitigated (status: ${r.status}).`,
        recommendation: `Implement and verify a risk control for ${r.riskId} before submission.`,
      })
    }
    else if (r.severity === 'major' && unmitigated) {
      findings.push({
        severity: 'major', category: 'risk', reference: r.riskId,
        description: `Major risk ${r.riskId} is not yet mitigated (status: ${r.status}).`,
        recommendation: `Progress ${r.riskId} to a mitigated state and record its verification.`,
      })
    }
    else if (r.status === 'mitigated' && !r.verificationRef) {
      findings.push({
        severity: 'minor', category: 'risk', reference: r.riskId,
        description: `Risk ${r.riskId} is marked mitigated without a verification reference.`,
        recommendation: `Record the verification/validation reference that confirms ${r.riskId} is controlled.`,
      })
    }
  }
  return findings
}

/** File-level signal: overall readiness below the submission threshold. */
function portfolioFindings(readinessPercent: number): SimulationFinding[] {
  if (readinessPercent >= READINESS_THRESHOLD) return []
  return [{
    severity: 'major', category: 'portfolio', reference: null,
    description: `Overall readiness (${readinessPercent}%) is below the ${READINESS_THRESHOLD}% submission threshold.`,
    recommendation: 'Resolve the open GSPR and risk deficiencies to raise readiness before submitting.',
  }]
}

function summarize(findings: SimulationFinding[]): SimulationSummary {
  return {
    total: findings.length,
    critical: findings.filter(f => f.severity === 'critical').length,
    major: findings.filter(f => f.severity === 'major').length,
    minor: findings.filter(f => f.severity === 'minor').length,
  }
}

/**
 * Run the (mock) Auditor Simulation for one technical file: a deterministic rule
 * engine over its GSPR conformity and ISO 14971 risk state that surfaces findings
 * the way a Notified Body reviewer might, most-severe first (FR-AUD-1).
 *
 * @param input - the file summary plus its GSPR and risk entries
 * @returns the findings with a severity summary and a pass/fail flag
 */
export function runAuditorSimulation(input: AuditorInput): AuditorSimulationResult {
  const findings = [
    ...gsprFindings(input.gspr),
    ...riskFindings(input.risks),
    ...portfolioFindings(input.readinessPercent),
  ].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])

  return {
    technicalFileId: input.technicalFileId,
    deviceName: input.deviceName,
    regulation: input.regulation,
    readinessPercent: input.readinessPercent,
    generatedAt: new Date().toISOString(),
    passed: findings.length === 0,
    summary: summarize(findings),
    findings,
  }
}
