import * as z from 'zod';

export const postCategoryFormSchema = z.object({
  name: z.string().min(2, { message: 'Kategori adı en az 2 karakter olmalıdır' }),
  slug: z.string().min(2, { message: 'Slug en az 2 karakter olmalıdır' }),
  content: z.string().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  isActive: z.boolean(),
  bannerImageId: z.number().nullable(),
  bannerImageFile: z.any().nullable()
});

export type PostCategoryFormValues = z.infer<typeof postCategoryFormSchema>;
