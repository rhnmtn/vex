import * as z from 'zod';

export const customerFormSchema = z.object({
  name: z.string().min(2, { message: 'Firma adı en az 2 karakter olmalıdır' }),
  contactName: z.string().optional(),
  email: z.union([z.string().email('Geçerli e-posta giriniz'), z.literal('')]).optional(),
  mobile: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  address: z.string().max(1000).optional(),
  taxOffice: z.string().max(100).optional(),
  taxNumber: z.string().max(20).optional(),
  description: z.string().max(1000).optional(),
  isActive: z.boolean()
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
