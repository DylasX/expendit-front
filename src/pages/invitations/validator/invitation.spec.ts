import { describe, it, expect } from 'vitest';
import { inviteValidator } from './invitation';

describe('inviteValidator', () => {
  describe('valid inputs', () => {
    it('should accept valid invitation with email', () => {
      const validData = {
        inviteEmails: 'test@example.com',
      };

      const result = inviteValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept invitation without inviteEmails', () => {
      const validData = {};

      const result = inviteValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept empty inviteEmails', () => {
      const validData = {
        inviteEmails: '',
      };

      const result = inviteValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept multiple emails separated by commas', () => {
      const validData = {
        inviteEmails: 'test1@example.com, test2@example.com',
      };

      const result = inviteValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should accept invitation with undefined inviteEmails', () => {
      const validData = {
        inviteEmails: undefined,
      };

      const result = inviteValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept long email list', () => {
      const validData = {
        inviteEmails: 'test1@example.com, test2@example.com, test3@example.com, test4@example.com',
      };

      const result = inviteValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept invitation with only whitespace', () => {
      const validData = {
        inviteEmails: '   ',
      };

      const result = inviteValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });
});
