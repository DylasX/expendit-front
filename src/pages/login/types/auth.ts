import {
  loginValidator,
  registerValidator,
} from '@/pages/login/validator/login';
import { z } from 'zod';

export type LoginPayload = z.infer<typeof loginValidator>;

export type RegisterPayload = z.infer<typeof registerValidator>;
