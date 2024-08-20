import { groupValidator } from '@/pages/groups/validator/group';
import { z } from 'zod';

export interface Group {
  id: number;
  name: string;
  color: string;
  balanceTotal: number;
  balances: Balance[];
  emoji: string;
}

export interface Balance {
  id: number;
  userId: number;
  debtUserRelated: number;
  groupId: number;
  amount: string;
  createdAt: string;
  updatedAt: string;
  user: {
    fullName: string;
    id: number;
  };
  debtUser: {
    fullName: string;
    id: number;
  };
}

export type GroupPayload = z.infer<typeof groupValidator>;
