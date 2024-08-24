import { z } from 'zod';

export const inviteValidator = z.object({
  inviteEmails: z.string().optional(),
});
