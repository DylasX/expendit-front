import { User } from '@/shared/types/user';

const USER_KEY = 'USER-STORAGE';
const TOKEN_KEY = 'TOKEN-STORAGE';

export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): User | undefined {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : undefined;
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | undefined {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? token : undefined;
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
