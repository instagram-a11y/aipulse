import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  company: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Message is too short'),
  language: z.enum(['en', 'fa']),
})

export type ContactInput = z.infer<typeof contactSchema>
