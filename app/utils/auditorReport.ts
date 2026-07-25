import type { AuditorSimulationResult } from '#shared/types/auditor'

/**
 * Render an Auditor Simulation result as a plain-Markdown report for download
 * (FR-AUD-2). Kept pure so it is unit-testable; the browser download itself
 * lives in the component. A Markdown/HTML export (rather than a server-side PDF)
 * is the MVP approach — see SDLC storage-and-reports.md.
 *
 * @param result - a completed simulation result
 * @returns the report as a Markdown string
 */
export function buildAuditorReportMarkdown(result: AuditorSimulationResult): string {
  const s = result.summary
  const outcome = result.passed
    ? 'PASS — no deficiencies found'
    : `${s.total} finding(s): ${s.critical} critical, ${s.major} major, ${s.minor} minor`

  const lines: string[] = [
    `# Auditor Simulation Report — ${result.deviceName}`,
    '',
    `- Regulation: ${result.regulation}`,
    `- Overall readiness: ${result.readinessPercent}%`,
    `- Generated: ${result.generatedAt}`,
    `- Result: ${outcome}`,
    '',
    '> Mock AI auditor review (deterministic rule engine). Not a regulatory determination.',
    '',
  ]

  if (result.findings.length === 0) {
    lines.push('No findings.')
  }
  else {
    lines.push('## Findings', '')
    result.findings.forEach((f, i) => {
      const ref = f.reference ? ` (${f.reference})` : ''
      lines.push(
        `### ${i + 1}. [${f.severity.toUpperCase()}] ${f.category}${ref}`,
        '',
        f.description,
        '',
        `**Recommendation:** ${f.recommendation}`,
        '',
      )
    })
  }

  return lines.join('\n')
}
