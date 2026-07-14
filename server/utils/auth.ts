// Auth domain logic, kept decoupled from Nitro's server-only auto-imports
// (explicit `h3` import instead) so it stays unit-testable with plain
// Vitest, no Nuxt runtime required.
import { createError } from 'h3'
import { eq } from 'drizzle-orm'
import type { Db } from './createDb'
import { users } from '../database/schema'

export interface RegisterInput {
  email: string
  password: string
  name: string
}

export interface PasswordHasher {
  hashPassword: (password: string) => Promise<string> | string
}

export interface PasswordVerifier {
  verifyPassword: (hash: string, password: string) => Promise<boolean> | boolean
}

/** Look up a user by email (case-insensitive). */
export function findUserByEmail(db: Db, email: string) {
  return db.select().from(users).where(eq(users.email, email.toLowerCase())).get()
}

/**
 * Create a new user with a hashed password. Self-registration always gets
 * the 'viewer' role; role escalation is an admin action (Phase 1+).
 * Throws a 409 if the email is already registered.
 */
export async function createUser(db: Db, input: RegisterInput, deps: PasswordHasher) {
  const existing = findUserByEmail(db, input.email)
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const now = new Date().toISOString()
  const passwordHash = await deps.hashPassword(input.password)

  const [user] = db.insert(users).values({
    email: input.email.toLowerCase(),
    passwordHash,
    name: input.name,
    role: 'viewer',
    createdAt: now,
    updatedAt: now,
  }).returning().all()

  if (!user) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create user' })
  }
  return user
}

/**
 * Verify email/password credentials. Returns the user row on success, or
 * null on any failure (unknown email or wrong password) without
 * distinguishing the two, to avoid leaking which emails are registered.
 */
export async function verifyCredentials(db: Db, email: string, password: string, deps: PasswordVerifier) {
  const user = findUserByEmail(db, email)
  if (!user) return null

  const valid = await deps.verifyPassword(user.passwordHash, password)
  return valid ? user : null
}
