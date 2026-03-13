import * as z from 'zod';

export const profileFormSchema = z.object({
  name: z.string().min(1, 'Ad Soyad gerekli').max(255),
  title: z.string().max(255).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  avatarMediaId: z.number().int().positive().nullable().optional(),
  avatarFile: z.instanceof(File).nullable().optional()
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
