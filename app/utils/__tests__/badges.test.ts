import { describe, it, expect } from 'vitest'
import { statusTone, severityTone, statusLabel, severityLabel, TONE_CLASS, TONE_SOLID } from '../badges'

describe('statusTone', () => {
  it('maps technical-file statuses', () => {
    expect(statusTone('approved')).toBe('approved')
    expect(statusTone('in_review')).toBe('review')
    expect(statusTone('deficiency')).toBe('deficiency')
    expect(statusTone('draft')).toBe('draft')
  })

  it('maps GSPR conformity and risk status', () => {
    expect(statusTone('conforming')).toBe('approved')
    expect(statusTone('partial')).toBe('review')
    expect(statusTone('missing')).toBe('deficiency')
    expect(statusTone('mitigated')).toBe('approved')
  })

  it('falls back to draft for unknown values', () => {
    expect(statusTone('something-new')).toBe('draft')
  })
})

describe('severityTone', () => {
  it('follows the STYLE_GUIDE severity mapping', () => {
    expect(severityTone('critical')).toBe('deficiency')
    expect(severityTone('high')).toBe('deficiency')
    expect(severityTone('major')).toBe('review')
    expect(severityTone('moderate')).toBe('review')
    expect(severityTone('medium')).toBe('review')
    expect(severityTone('minor')).toBe('draft')
    expect(severityTone('low')).toBe('draft')
    expect(severityTone('resolved')).toBe('approved')
  })
})

describe('labels', () => {
  it('humanizes underscored enums', () => {
    expect(statusLabel('in_review')).toBe('In review')
    expect(statusLabel('conforming')).toBe('Conforming')
    expect(severityLabel('critical')).toBe('Critical')
  })
})

describe('tone class maps', () => {
  const tones = ['approved', 'review', 'deficiency', 'draft'] as const

  it('pairs a text and background class for every tone', () => {
    for (const tone of tones) {
      expect(TONE_CLASS[tone]).toMatch(/text-status-\S+ bg-status-\S+/)
    }
  })

  it('provides a solid fill for every tone', () => {
    for (const tone of tones) {
      expect(TONE_SOLID[tone]).toMatch(/^bg-status-\S+$/)
    }
  })
})
