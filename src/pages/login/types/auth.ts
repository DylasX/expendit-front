import { loginValidator } from '@/pages/login/validator/login';
import { Infer } from '@vinejs/vine/types';

export type LoginPayload = Infer<typeof loginValidator>;
