import * as z from 'zod';

export const companyFormSchema = z.object({
  name: z.string().min(2, { message: 'Şirket adı en az 2 karakter olmalıdır' }),
  shortName: z
    .string()
    .min(2, { message: 'Kısa ad en az 2 karakter olmalıdır' })
    .max(50),
  taxOffice: z.string().min(1, { message: 'Vergi dairesi zorunludur' }),
  taxNumber: z.string().min(1, { message: 'Vergi numarası zorunludur' }),
  address: z.string().max(1000).optional(),
  city: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  mobile: z.string().max(20).optional(),
  email: z
    .union([z.string().email('Geçerli e-posta giriniz'), z.literal('')])
    .optional(),
  website: z.string().max(255).optional(),
  description: z.string().max(1000).optional(),
  isActive: z.boolean(),
  logoLightMediaId: z.number().nullable(),
  logoLightFile: z.union([z.instanceof(File), z.null()]).optional(),
  logoDarkMediaId: z.number().nullable(),
  logoDarkFile: z.union([z.instanceof(File), z.null()]).optional(),
  heroImageMediaId: z.number().nullable(),
  heroImageFile: z.union([z.instanceof(File), z.null()]).optional(),
  heroText: z.string().max(255).optional(),
  heroSubtitle: z.string().max(500).optional()
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
