export interface Group {
  id: number;
  name: string;
  color: string;
  balanceTotal: number;
  balances: Balance[];
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
