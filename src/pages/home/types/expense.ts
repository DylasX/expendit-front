import { expenseValidator } from '@/pages/home/validator/expense';
import { z } from 'zod';

export interface Expense {
  id: number;
  ownerUserId: number;
  groupId: number;
  amount: string;
  description: string;
  divisionStrategy: string;
  createdAt: string;
  updatedAt: string;
  amountByUser: string;
  color: string;
}

export type ExpensePayload = z.infer<typeof expenseValidator>;
