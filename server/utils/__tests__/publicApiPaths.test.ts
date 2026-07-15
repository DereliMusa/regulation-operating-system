import { describe, it, expect } from 'vitest'
import { isPublicApiPath } from '../publicApiPaths'

describe('isPublicApiPath', () => {
  it('allows our own public routes', () => {
    expect(isPublicApiPath('/api/auth/login')).toBe(true)
    expect(isPublicApiPath('/api/demo-requests')).toBe(true)
    expect(isPublicApiPath('/api/dev/seed')).toBe(true)
  })

  it('allows Nuxt modules\' own internal endpoints (leading underscore)', () => {
    // Regression: nuxt-auth-utils' session check and Nuxt Icon's icon
    // fetch were both getting a 401 from this middleware instead of their
    // own handler, which made the login form appear to do nothing.
    expect(isPublicApiPath('/api/_auth/session')).toBe(true)
    expect(isPublicApiPath('/api/_nuxt_icon/lucide.json')).toBe(true)
  })

  it('protects real resource routes by default', () => {
    expect(isPublicApiPath('/api/technical-files')).toBe(false)
    expect(isPublicApiPath('/api/dashboard/stats')).toBe(false)
  })
})
