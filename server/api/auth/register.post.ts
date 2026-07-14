import { z } from 'zod'
import { createUser } from '../../utils/auth'
import { db } from '../../utils/db'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(200),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse)
  const user = await createUser(db, body, { hashPassword })

  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  })

  return { id: user.id, email: user.email, name: user.name, role: user.role }
})
