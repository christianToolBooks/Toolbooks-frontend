import { z } from 'zod';

export const accountFormSchema = z.object({
  account_code: z
    .string()
    .min(1, 'Account code is required'),
  account_name: z
    .string()
    .min(1, 'Account name is required'),
  account_type: z.enum(['asset', 'liability', 'equity', 'income', 'expense'], {
    required_error: 'Account type is required',
  }),
  normal_balance: z.enum(['debit', 'credit'], {
    required_error: 'Normal balance is required',
  }),
  description: z.string().optional(),
  status: z.boolean().optional(),
  reporting_category: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;