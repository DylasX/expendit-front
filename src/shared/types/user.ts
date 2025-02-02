export interface User {
  email: string;
  id: number;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  myCredit: myCredit[];
  myDebt: myDebt[];
  color: string;
  amount?: string;
}

interface myCredit {
  id: number;
  userId: number;
  debtUserRelated: number;
  groupId: number;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

interface myDebt {
  id: number;
  userId: number;
  debtUserRelated: number;
  groupId: number;
  amount: string;
  createdAt: string;
  updatedAt: string;
}
