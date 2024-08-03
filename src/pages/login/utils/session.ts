const TOKEN_KEY = 'TOKEN-STORAGE';

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
