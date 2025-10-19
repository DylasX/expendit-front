import { describe, it, expect } from 'vitest';
import { loginValidator, registerValidator } from './login';

describe('loginValidator', () => {
  describe('valid inputs', () => {
    it('should accept valid login credentials', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept password with exactly 8 characters', () => {
      const validData = {
        email: 'test@example.com',
        password: '12345678',
      };

      const result = loginValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = loginValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '1234567',
      };

      const result = loginValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
      }
    });

    it('should reject missing email', () => {
      const invalidData = {
        password: 'password123',
      };

      const result = loginValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      };

      const result = loginValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });
});

describe('registerValidator', () => {
  describe('valid inputs', () => {
    it('should accept valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
      };

      const result = registerValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept password with exactly 8 characters', () => {
      const validData = {
        email: 'test@example.com',
        password: '12345678',
        fullName: 'John Doe',
      };

      const result = registerValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept password with exactly 32 characters', () => {
      const validData = {
        email: 'test@example.com',
        password: '12345678901234567890123456789012',
        fullName: 'John Doe',
      };

      const result = registerValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept fullName with exactly 3 characters', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'ABC',
      };

      const result = registerValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept fullName with exactly 32 characters', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: '12345678901234567890123456789012',
      };

      const result = registerValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
        fullName: 'John Doe',
      };

      const result = registerValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '1234567',
        fullName: 'John Doe',
      };

      const result = registerValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
      }
    });

    it('should reject password longer than 32 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123456789012345678901234567890123',
        fullName: 'John Doe',
      };

      const result = registerValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at most 32 characters');
      }
    });

    it('should reject fullName shorter than 3 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'AB',
      };

      const result = registerValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Fullname must be at least 3 characters');
      }
    });

    it('should reject fullName longer than 32 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: '123456789012345678901234567890123',
      };

      const result = registerValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Fullname must be at most 32 characters');
      }
    });

    it('should reject missing email', () => {
      const invalidData = {
        password: 'password123',
        fullName: 'John Doe',
      };

      const result = registerValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
        fullName: 'John Doe',
      };

      const result = registerValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject missing fullName', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = registerValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });
});
