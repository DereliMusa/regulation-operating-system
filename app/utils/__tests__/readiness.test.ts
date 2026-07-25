import { describe, it, expect } from 'vitest'
import { clampPercent, ringGradient } from '../readiness'

describe('clampPercent', () => {
  it('rounds and clamps into the 0-100 range', () => {
    expect(clampPercent(72.4)).toBe(72)
    expect(clampPercent(72.6)).toBe(73)
    expect(clampPercent(-5)).toBe(0)
    expect(clampPercent(150)).toBe(100)
  })

  it('treats non-finite input as 0', () => {
    expect(clampPercent(Number.NaN)).toBe(0)
    expect(clampPercent(Number.POSITIVE_INFINITY)).toBe(0)
  })
})

describe('ringGradient', () => {
  it('embeds the clamped percent in the conic arc', () => {
    expect(ringGradient(72)).toContain('72%')
    expect(ringGradient(150)).toContain('100%')
  })

  it('references design tokens rather than hardcoded colors', () => {
    expect(ringGradient(50)).toContain('var(--color-brand-500)')
    expect(ringGradient(50)).toContain('var(--color-line)')
  })
})
