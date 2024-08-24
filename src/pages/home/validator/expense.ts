import { z } from 'zod';

export const expenseValidator = z
  .object({
    description: z.string().min(3, 'description is too short'),
    emoji: z.string().default('👥'),
    amount: z.number().min(1, 'amount is too low'),
    divisionStrategy: z
      .string()
      .refine(
        (value) => ['equals', 'value', 'percentage'].includes(value),
        'invalid division strategy'
      ),
    members: z
      .array(
        z.object({
          id: z.number(),
          amount: z.number(),
        })
      )
      .length(1, 'must have at least 1 member'),
  })
  .refine(
    (data) => {
      const totalMemberAmount = data.members.reduce(
        (sum, member) => sum + member.amount,
        0
      );
      return totalMemberAmount === data.amount;
    },
    {
      message: 'The sum of member amounts must be equal to the group amount',
      path: ['members'],
    }
  );
