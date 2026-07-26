// Portfolio risk register (FR-RISK-2): every risk across all files, joined to
// its device name, with a severity/status summary. Read-only over seed data.
import type { Db } from './createDb'
import { riskEntries, technicalFiles } from '../database/schema'
import type { RiskSeverity, RiskRegisterItem, RiskRegisterView } from '#shared/types/risk'

const SEVERITY_RANK: Record<RiskSeverity, number> = { critical: 0, major: 1, moderate: 2, minor: 3 }

/**
 * Aggregate the standalone Risk Management register: all risk entries joined to
 * their device, sorted most-severe first, plus counts by severity and the number
 * still unmitigated.
 */
export function getRiskRegister(db: Db): RiskRegisterView {
  const risks = db.select().from(riskEntries).all()
  const files = db.select().from(technicalFiles).all()
  const deviceName = new Map(files.map(f => [f.id, f.deviceName]))

  const items: RiskRegisterItem[] = risks
    .map(r => ({ ...r, deviceName: deviceName.get(r.technicalFileId) ?? 'Unknown device' }))
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])

  const bySeverity: Record<RiskSeverity, number> = { critical: 0, major: 0, moderate: 0, minor: 0 }
  for (const r of items) bySeverity[r.severity]++

  return {
    items,
    summary: {
      total: items.length,
      bySeverity,
      unmitigated: items.filter(r => r.status !== 'mitigated').length,
    },
  }
}
