import { z } from 'zod';

export const loginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

export const registerValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
  fullName: z.string().min(3).max(32),
});
