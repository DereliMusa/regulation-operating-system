import { describe, it, expect } from 'vitest'
import { createDb } from '../createDb'
import { createUser, verifyCredentials, findUserByEmail } from '../auth'

// Trivial, deterministic hasher/verifier so these tests exercise the auth
// domain logic without depending on nuxt-auth-utils' real scrypt hashing.
const hashPassword = async (password: string) => `hashed:${password}`
const verifyPassword = async (hash: string, password: string) => hash === `hashed:${password}`

describe('createUser', () => {
  it('creates a user with a hashed password and the default viewer role', async () => {
    const db = createDb(':memory:')

    const user = await createUser(db, { email: 'RA@Example.com', password: 'super-secret', name: 'Jane Doe' }, { hashPassword })

    expect(user.email).toBe('ra@example.com')
    expect(user.name).toBe('Jane Doe')
    expect(user.role).toBe('viewer')
    expect(user.passwordHash).toBe('hashed:super-secret')
  })

  it('rejects a duplicate email with a 409 error', async () => {
    const db = createDb(':memory:')
    await createUser(db, { email: 'ra@example.com', password: 'super-secret', name: 'Jane Doe' }, { hashPassword })

    await expect(
      createUser(db, { email: 'ra@example.com', password: 'another-secret', name: 'Jane Two' }, { hashPassword }),
    ).rejects.toMatchObject({ statusCode: 409 })
  })
})

describe('verifyCredentials', () => {
  it('returns the user when the password matches', async () => {
    const db = createDb(':memory:')
    await createUser(db, { email: 'ra@example.com', password: 'super-secret', name: 'Jane Doe' }, { hashPassword })

    const user = await verifyCredentials(db, 'ra@example.com', 'super-secret', { verifyPassword })

    expect(user?.email).toBe('ra@example.com')
  })

  it('returns null when the password does not match', async () => {
    const db = createDb(':memory:')
    await createUser(db, { email: 'ra@example.com', password: 'super-secret', name: 'Jane Doe' }, { hashPassword })

    const user = await verifyCredentials(db, 'ra@example.com', 'wrong-password', { verifyPassword })

    expect(user).toBeNull()
  })

  it('returns null when the email is not registered', async () => {
    const db = createDb(':memory:')

    const user = await verifyCredentials(db, 'nobody@example.com', 'super-secret', { verifyPassword })

    expect(user).toBeNull()
  })
})

describe('findUserByEmail', () => {
  it('matches regardless of email casing', async () => {
    const db = createDb(':memory:')
    await createUser(db, { email: 'ra@example.com', password: 'super-secret', name: 'Jane Doe' }, { hashPassword })

    expect(findUserByEmail(db, 'RA@EXAMPLE.COM')?.name).toBe('Jane Doe')
  })
})
