import * as z from 'zod';

export const pageFormSchema = z.object({
  title: z.string().min(2, { message: 'Başlık en az 2 karakter olmalıdır' }),
  slug: z.string().min(2, { message: 'Slug en az 2 karakter olmalıdır' }),
  content: z.string().optional().or(z.literal('')),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  isActive: z.boolean(),
  featuredImageId: z.number().nullable(),
  featuredImageFile: z.any().nullable()
});

export type PageFormValues = z.infer<typeof pageFormSchema>;
