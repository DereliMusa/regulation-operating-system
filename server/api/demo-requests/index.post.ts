import { z } from 'zod'
import { createDemoRequest } from '../../utils/demoRequests'
import { db } from '../../utils/db'

const demoRequestSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200),
  workEmail: z.string().email('Enter a valid work email'),
  company: z.string().max(200).optional(),
  role: z.enum(['ra_qa', 'founder_ceo', 'clinical', 'consultant']).optional(),
  regulationFocus: z.enum(['MDR', 'IVDR', 'both']).optional(),
  message: z.string().max(2000).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, demoRequestSchema.parse)
  return createDemoRequest(db, body)
})
