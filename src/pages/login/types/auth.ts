import { loginValidator, RegisterPayload } from '@/pages/login/validator/login';
import { Infer } from '@vinejs/vine/types';

export type LoginPayload = Infer<typeof loginValidator>;

export type RegisterPayload = Infer<typeof RegisterPayload>;
