import { describe, it, expect } from 'vitest';
import { expenseValidator } from './expense';

describe('expenseValidator', () => {
  describe('valid inputs', () => {
    it('should accept valid expense with EQUALS strategy', () => {
      const validData = {
        description: 'Dinner',
        amount: 100,
        groupId: 1,
        divisionStrategy: 'EQUALS',
        participants: [
          { id: 1, amount: 50 },
          { id: 2, amount: 50 },
        ],
      };

      const result = expenseValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept valid expense with MANUAL strategy', () => {
      const validData = {
        description: 'Lunch',
        amount: 60,
        groupId: 1,
        divisionStrategy: 'MANUAL',
        participants: [
          { id: 1, amount: 40 },
          { id: 2, amount: 20 },
        ],
      };

      const result = expenseValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept expense with more than 2 participants', () => {
      const validData = {
        description: 'Group Dinner',
        amount: 150,
        groupId: 1,
        divisionStrategy: 'MANUAL',
        participants: [
          { id: 1, amount: 50 },
          { id: 2, amount: 50 },
          { id: 3, amount: 50 },
        ],
      };

      const result = expenseValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject description shorter than 3 characters', () => {
      const invalidData = {
        description: 'AB',
        amount: 100,
        groupId: 1,
        divisionStrategy: 'EQUALS',
        participants: [
          { id: 1, amount: 50 },
          { id: 2, amount: 50 },
        ],
      };

      const result = expenseValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description is too short');
      }
    });

    it('should reject amount less than 1', () => {
      const invalidData = {
        description: 'Dinner',
        amount: 0,
        groupId: 1,
        divisionStrategy: 'EQUALS',
        participants: [
          { id: 1, amount: 0 },
          { id: 2, amount: 0 },
        ],
      };

      const result = expenseValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Amount is too low');
      }
    });

    it('should reject invalid division strategy', () => {
      const invalidData = {
        description: 'Dinner',
        amount: 100,
        groupId: 1,
        divisionStrategy: 'INVALID',
        participants: [
          { id: 1, amount: 50 },
          { id: 2, amount: 50 },
        ],
      };

      const result = expenseValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid division strategy');
      }
    });

    it('should reject less than 2 participants', () => {
      const invalidData = {
        description: 'Dinner',
        amount: 100,
        groupId: 1,
        divisionStrategy: 'EQUALS',
        participants: [{ id: 1, amount: 100 }],
      };

      const result = expenseValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('At least 2 member are required');
      }
    });

    it('should reject when participant amounts do not sum to total', () => {
      const invalidData = {
        description: 'Dinner',
        amount: 100,
        groupId: 1,
        divisionStrategy: 'MANUAL',
        participants: [
          { id: 1, amount: 40 },
          { id: 2, amount: 40 },
        ],
      };

      const result = expenseValidator.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'The sum of member amounts must be equal to the group amount'
        );
      }
    });
  });

  describe('edge cases', () => {
    it('should accept exactly 3 character description', () => {
      const validData = {
        description: 'ABC',
        amount: 100,
        groupId: 1,
        divisionStrategy: 'EQUALS',
        participants: [
          { id: 1, amount: 50 },
          { id: 2, amount: 50 },
        ],
      };

      const result = expenseValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept exactly 2 participants', () => {
      const validData = {
        description: 'Dinner',
        amount: 100,
        groupId: 1,
        divisionStrategy: 'EQUALS',
        participants: [
          { id: 1, amount: 50 },
          { id: 2, amount: 50 },
        ],
      };

      const result = expenseValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept amount of exactly 1', () => {
      const validData = {
        description: 'Coffee',
        amount: 1,
        groupId: 1,
        divisionStrategy: 'MANUAL',
        participants: [
          { id: 1, amount: 0.5 },
          { id: 2, amount: 0.5 },
        ],
      };

      const result = expenseValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should handle decimal amounts correctly', () => {
      const validData = {
        description: 'Lunch',
        amount: 33.33,
        groupId: 1,
        divisionStrategy: 'MANUAL',
        participants: [
          { id: 1, amount: 16.67 },
          { id: 2, amount: 16.66 },
        ],
      };

      const result = expenseValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should handle large amounts', () => {
      const validData = {
        description: 'Expensive dinner',
        amount: 10000,
        groupId: 1,
        divisionStrategy: 'EQUALS',
        participants: [
          { id: 1, amount: 5000 },
          { id: 2, amount: 5000 },
        ],
      };

      const result = expenseValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should handle multiple participants with different amounts', () => {
      const validData = {
        description: 'Group dinner',
        amount: 100,
        groupId: 1,
        divisionStrategy: 'MANUAL',
        participants: [
          { id: 1, amount: 40 },
          { id: 2, amount: 30 },
          { id: 3, amount: 30 },
        ],
      };

      const result = expenseValidator.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });
});
