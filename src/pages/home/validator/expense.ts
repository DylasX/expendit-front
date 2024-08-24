import { z } from 'zod';

export const expenseValidator = z
  .object({
    description: z.string().min(3, 'Description is too short'),
    emoji: z.string().default('👥'),
    amount: z.number().min(1, 'Amount is too low'),
    groupId: z.number(),
    divisionStrategy: z
      .string()
      .refine(
        (value) => ['EQUALS', 'VALUES', 'PERCENTAGE'].includes(value),
        'Invalid division strategy'
      ),
    participants: z
      .array(
        z.object({
          id: z.number(),
          amount: z.number(),
        })
      )
      .min(2, 'At least 2 member are required'),
  })
  .refine(
    (data) => {
      if (data.divisionStrategy === 'percentage') {
        const totalMemberPercentage = data.participants.reduce(
          (sum, member) => sum + member.amount,
          0
        );
        return totalMemberPercentage === 100;
      }
      const totalMemberAmount = data.participants.reduce(
        (sum, member) => sum + member.amount,
        0
      );
      return totalMemberAmount === data.amount;
    },
    {
      message: 'The sum of member amounts must be equal to the group amount',
      path: ['participants'],
    }
  );
