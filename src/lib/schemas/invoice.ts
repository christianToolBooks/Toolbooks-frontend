import { z } from 'zod';

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export const invoiceFormSchema = z.object({
  clientName: z
    .string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .optional(),
  clientEmail: z.string().email('Invalid email').optional(),
  issueDate: z.date({ required_error: 'Issue date is required' }),
  dueDate: z.date().optional(),
  items: z
    .array(
      z.object({
        id: z.string().optional(),
        description: z.string().min(1, 'Description is required'),
        quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
        unit_price: z.coerce.number().min(0, 'Price cannot be negative'),
        tax: z.coerce.number().min(0, 'Tax cannot be negative'),
      })
    )
    .min(1, 'You must add at least one item'),
  notes: z.string().optional(),
});
