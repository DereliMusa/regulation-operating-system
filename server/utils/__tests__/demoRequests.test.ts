import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { createDemoRequest } from '../demoRequests'
import { demoRequests } from '../../database/schema'

describe('createDemoRequest', () => {
  it('persists a lead with all fields', () => {
    const db = createDb(':memory:')

    const request = createDemoRequest(db, {
      fullName: 'Jane Doe',
      workEmail: 'jane@medtech.example',
      company: 'MedTech Inc.',
      role: 'ra_qa',
      regulationFocus: 'MDR',
      message: 'Interested in the auditor simulation.',
    })

    expect(request.id).toBeGreaterThan(0)
    expect(request.fullName).toBe('Jane Doe')
    expect(request.company).toBe('MedTech Inc.')
    expect(request.createdAt).toEqual(expect.any(String))

    const stored = db.select().from(demoRequests).all()
    expect(stored).toHaveLength(1)
  })

  it('defaults optional fields to null', () => {
    const db = createDb(':memory:')

    const request = createDemoRequest(db, {
      fullName: 'John Smith',
      workEmail: 'john@example.com',
    })

    expect(request.company).toBeNull()
    expect(request.role).toBeNull()
    expect(request.regulationFocus).toBeNull()
    expect(request.message).toBeNull()
  })
})
