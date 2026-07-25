/**
 * Visual vocabulary shared by StatusBadge and SeverityBadge. Every status,
 * conformity, or severity string across the app resolves to one of the four
 * STYLE_GUIDE status color tones (section 1), so badge colors never drift and
 * a single mapping is the source of truth.
 */

export type BadgeTone = 'approved' | 'review' | 'deficiency' | 'draft'

/** Text + background utility classes per tone (STYLE_GUIDE status token pairs). */
export const TONE_CLASS: Record<BadgeTone, string> = {
  approved: 'text-status-approved bg-status-approved-bg',
  review: 'text-status-review bg-status-review-bg',
  deficiency: 'text-status-deficiency bg-status-deficiency-bg',
  draft: 'text-status-draft bg-status-draft-bg',
}

/** Solid background per tone, used for progress fills and status dots. */
export const TONE_SOLID: Record<BadgeTone, string> = {
  approved: 'bg-status-approved',
  review: 'bg-status-review',
  deficiency: 'bg-status-deficiency',
  draft: 'bg-status-draft',
}

// Status / conformity strings -> tone. Covers technical-file status,
// GSPR conformity, and risk status (see shared/types/*).
const STATUS_TONE: Record<string, BadgeTone> = {
  draft: 'draft',
  in_review: 'review',
  review: 'review',
  approved: 'approved',
  deficiency: 'deficiency',
  conforming: 'approved',
  partial: 'review',
  missing: 'deficiency',
  mitigated: 'approved',
}

// Severity strings -> tone (STYLE_GUIDE severity mapping: critical/high red,
// major/moderate/medium amber, minor/low gray, resolved/approved green).
const SEVERITY_TONE: Record<string, BadgeTone> = {
  critical: 'deficiency',
  high: 'deficiency',
  major: 'review',
  moderate: 'review',
  medium: 'review',
  minor: 'draft',
  low: 'draft',
  resolved: 'approved',
  approved: 'approved',
}

/** Capitalize and de-underscore a raw enum value for display. */
function humanize(value: string): string {
  const spaced = value.replace(/_/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/**
 * Resolve a status / conformity string to its badge tone.
 * @param status - e.g. 'in_review', 'conforming', 'mitigated'
 * @returns the matching tone, or 'draft' when unknown
 */
export function statusTone(status: string): BadgeTone {
  return STATUS_TONE[status] ?? 'draft'
}

/**
 * Resolve a severity string to its badge tone (STYLE_GUIDE severity mapping).
 * @param severity - e.g. 'critical', 'major', 'minor'
 * @returns the matching tone, or 'draft' when unknown
 */
export function severityTone(severity: string): BadgeTone {
  return SEVERITY_TONE[severity] ?? 'draft'
}

/** Human-readable label for a status string (e.g. 'in_review' -> 'In review'). */
export function statusLabel(status: string): string {
  return humanize(status)
}

/** Human-readable label for a severity string (e.g. 'critical' -> 'Critical'). */
export function severityLabel(severity: string): string {
  return humanize(severity)
}
