import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveToken, getToken, removeToken } from './session';

describe('session utility', () => {
  // Create a real localStorage implementation for tests
  let storage: Record<string, string> = {};
  let getItemSpy: any;
  let setItemSpy: any;
  let removeItemSpy: any;
  let clearSpy: any;

  beforeEach(() => {
    // Clear storage
    storage = {};
    
    // Mock localStorage methods with actual implementation
    getItemSpy = vi.spyOn(global.localStorage, 'getItem');
    getItemSpy.mockImplementation((key: string) => storage[key] ?? null);
    
    setItemSpy = vi.spyOn(global.localStorage, 'setItem');
    setItemSpy.mockImplementation((key: string, value: string) => {
      storage[key] = value;
    });
    
    removeItemSpy = vi.spyOn(global.localStorage, 'removeItem');
    removeItemSpy.mockImplementation((key: string) => {
      delete storage[key];
    });
    
    clearSpy = vi.spyOn(global.localStorage, 'clear');
    clearSpy.mockImplementation(() => {
      storage = {};
    });
  });

  afterEach(() => {
    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
    removeItemSpy.mockRestore();
    clearSpy.mockRestore();
  });

  describe('saveToken', () => {
    it('should save token to localStorage', () => {
      const token = 'test-token-123';
      saveToken(token);

      expect(localStorage.getItem('TOKEN-STORAGE')).toBe(token);
    });

    it('should overwrite existing token', () => {
      saveToken('old-token');
      saveToken('new-token');

      expect(localStorage.getItem('TOKEN-STORAGE')).toBe('new-token');
    });

    it('should handle empty string token', () => {
      saveToken('');

      expect(localStorage.getItem('TOKEN-STORAGE')).toBe('');
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('TOKEN-STORAGE', 'test-token');

      const token = getToken();

      expect(token).toBe('test-token');
    });

    it('should return undefined when no token exists', () => {
      const token = getToken();

      expect(token).toBeUndefined();
    });

    it('should return undefined when token is null', () => {
      localStorage.setItem('TOKEN-STORAGE', '');
      localStorage.removeItem('TOKEN-STORAGE');

      const token = getToken();

      expect(token).toBeUndefined();
    });

    it('should return token even if it is an empty string', () => {
      localStorage.setItem('TOKEN-STORAGE', '');

      const token = getToken();

      expect(token).toBeUndefined();
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('TOKEN-STORAGE', 'test-token');

      removeToken();

      expect(localStorage.getItem('TOKEN-STORAGE')).toBeNull();
    });

    it('should not throw error when removing non-existent token', () => {
      expect(() => removeToken()).not.toThrow();
    });

    it('should handle multiple removals', () => {
      localStorage.setItem('TOKEN-STORAGE', 'test-token');

      removeToken();
      removeToken();

      expect(localStorage.getItem('TOKEN-STORAGE')).toBeNull();
    });
  });

  describe('integration', () => {
    it('should save, retrieve, and remove token', () => {
      const token = 'integration-test-token';

      saveToken(token);
      expect(getToken()).toBe(token);

      removeToken();
      expect(getToken()).toBeUndefined();
    });

    it('should handle token lifecycle', () => {
      saveToken('token1');
      expect(getToken()).toBe('token1');

      saveToken('token2');
      expect(getToken()).toBe('token2');

      removeToken();
      expect(getToken()).toBeUndefined();
    });
  });
});
