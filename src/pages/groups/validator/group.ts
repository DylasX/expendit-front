import { z } from 'zod';

export const groupValidator = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color'),
  inviteEmails: z.string().optional(),
});
