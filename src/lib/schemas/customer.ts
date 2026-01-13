import { z } from 'zod';
import { isValidUSPhone } from '../utils/validates'; 

export type CustomerFormValues = z.infer<typeof customerSchema>;

export const customerSchema = z.object({
  name: z
    .string()
    .max(50, 'Namme is too long')
    .refine(val => !val || val.length >= 2, {
      message: 'Name is too short',
    })
    .optional()
    .transform(value => (value === '' ? undefined : value)),

  email: z
    .string()
    .email('Invalid email')
    .max(100, 'Email cannot exceed 100 characters')
    .toLowerCase(),

  phoneNumber: z
    .string()
    .min(10, 'Phone number must be 10 digits')
    .max(10, 'Phone number cannot exceed 10 digits')
    .refine(phone => isValidUSPhone(phone), {
      message: 'Please enter a valid US phone number',
    }),
});
