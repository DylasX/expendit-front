export interface User {
  token: string;
  user: {
    email: string;
    id: number;
    fullname: string;
    createdAt: string;
    updatedAt: string;
  };
}
