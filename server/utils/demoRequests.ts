// Demo-request domain logic, kept in server/utils (not inline in the route)
// so it is unit-testable the same way as auth.ts (see its tests).
import { createError } from 'h3'
import type { Db } from './createDb'
import { demoRequests } from '../database/schema'
import type { DemoRequest, DemoRequestRole, RegulationFocus } from '#shared/types/demo-request'

export interface CreateDemoRequestInput {
  fullName: string
  workEmail: string
  company?: string
  role?: DemoRequestRole
  regulationFocus?: RegulationFocus
  message?: string
}

/** Persist a public "Book a demo" lead. */
export function createDemoRequest(db: Db, input: CreateDemoRequestInput): DemoRequest {
  const [request] = db.insert(demoRequests).values({
    fullName: input.fullName,
    workEmail: input.workEmail,
    company: input.company ?? null,
    role: input.role ?? null,
    regulationFocus: input.regulationFocus ?? null,
    message: input.message ?? null,
    createdAt: new Date().toISOString(),
  }).returning().all()

  if (!request) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to save demo request' })
  }
  return request
}
