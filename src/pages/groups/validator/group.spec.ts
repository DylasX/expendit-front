import { describe, it, expect } from 'vitest';
import { groupValidator } from './group';

describe('groupValidator', () => {
  describe('valid inputs', () => {
    it('should accept valid group data', () => {
      const validData = {
        name: 'Test Group',
        color: '#FF0000',
      };

      const result = groupValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept valid group with optional inviteEmails', () => {
      const validData = {
        name: 'Test Group',
        color: '#FF0000',
        inviteEmails: 'test@example.com',
      };

      const result = groupValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept 3-character hex color', () => {
      const validData = {
        name: 'Test Group',
        color: '#F00',
      };

      const result = groupValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept 6-character hex color', () => {
      const validData = {
        name: 'Test Group',
        color: '#FF0000',
      };

      const result = groupValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject name shorter than 3 characters', () => {
      const invalidData = {
        name: 'AB',
        color: '#FF0000',
      };

      const result = groupValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must be at least 3 characters');
      }
    });

    it('should reject invalid color format', () => {
      const invalidData = {
        name: 'Test Group',
        color: 'FF0000',
      };

      const result = groupValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid color');
      }
    });

    it('should reject color with invalid characters', () => {
      const invalidData = {
        name: 'Test Group',
        color: '#GGGGGG',
      };

      const result = groupValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject missing name', () => {
      const invalidData = {
        color: '#FF0000',
      };

      const result = groupValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject missing color', () => {
      const invalidData = {
        name: 'Test Group',
      };

      const result = groupValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should accept exactly 3 character name', () => {
      const validData = {
        name: 'ABC',
        color: '#FF0000',
      };

      const result = groupValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept empty inviteEmails', () => {
      const validData = {
        name: 'Test Group',
        color: '#FF0000',
        inviteEmails: '',
      };

      const result = groupValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept lowercase hex color', () => {
      const validData = {
        name: 'Test Group',
        color: '#ff0000',
      };

      const result = groupValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept mixed case hex color', () => {
      const validData = {
        name: 'Test Group',
        color: '#Ff00Aa',
      };

      const result = groupValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });
});
