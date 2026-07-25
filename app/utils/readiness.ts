/**
 * Progress helpers for ReadinessRing and ReadinessBar. The STYLE_GUIDE renders
 * readiness "in primary"; callers may override the fill tone for at-a-glance
 * status (e.g. a completed file in approved green).
 */

/** Clamp any numeric input to an integer percentage in the range 0-100. */
export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.max(0, Math.min(100, Math.round(value)))
}

/**
 * Build the CSS `background` value for a readiness ring at the given percent.
 * Uses design tokens (never hardcoded hex) so the ring tracks the brand color.
 *
 * @param percent - 0-100 (clamped)
 * @param fill - CSS color for the filled arc (defaults to the brand token)
 * @param track - CSS color for the remaining arc
 * @returns a `background` shorthand combining the inner mask and the conic arc
 */
export function ringGradient(
  percent: number,
  fill = 'var(--color-brand-500)',
  track = 'var(--color-line)',
): string {
  const p = clampPercent(percent)
  return `radial-gradient(closest-side, var(--color-surface) 79%, transparent 80% 100%), conic-gradient(${fill} ${p}%, ${track} 0)`
}
