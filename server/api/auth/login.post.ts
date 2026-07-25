import { z } from 'zod'
import { verifyCredentials } from '../../utils/auth'
import { db } from '../../utils/db'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse)
  const user = await verifyCredentials(db, body.email, body.password, { verifyPassword })

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  })

  return { id: user.id, email: user.email, name: user.name, role: user.role }
})
