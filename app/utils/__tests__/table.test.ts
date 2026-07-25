import { describe, it, expect } from 'vitest'
import { resolveCellValue } from '../table'

describe('resolveCellValue', () => {
  it('reads a top-level property', () => {
    expect(resolveCellValue({ id: 7 }, 'id')).toBe(7)
  })

  it('reads a nested property via a dot path', () => {
    expect(resolveCellValue({ device: { name: 'OrthoFix' } }, 'device.name')).toBe('OrthoFix')
  })

  it('returns undefined when a segment is missing', () => {
    expect(resolveCellValue({ device: null }, 'device.name')).toBeUndefined()
    expect(resolveCellValue({}, 'nope.here')).toBeUndefined()
  })
})
