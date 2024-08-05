import { z } from 'zod';

export const loginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters'),
  fullName: z
    .string()
    .min(3, 'Fullname must be at least 3 characters')
    .max(32, 'Fullname must be at most 32 characters'),
});
