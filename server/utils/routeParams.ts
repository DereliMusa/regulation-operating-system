import { createError, getRouterParam, type H3Event } from 'h3'

/**
 * Read a positive-integer route parameter (default `id`), throwing a 400 when
 * it is missing or not a valid id. Explicit `h3` imports keep it unit-testable.
 */
export function getIdParam(event: H3Event, name = 'id'): number {
  const value = Number(getRouterParam(event, name))
  if (!Number.isInteger(value) || value <= 0) {
    throw createError({ statusCode: 400, statusMessage: `Invalid ${name}` })
  }
  return value
}
