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
  emoji: string;
}
