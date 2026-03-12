import * as z from 'zod';

export const postFormSchema = z.object({
  title: z.string().min(2, { message: 'Başlık en az 2 karakter olmalıdır' }),
  slug: z.string().min(2, { message: 'Slug en az 2 karakter olmalıdır' }),
  content: z.string().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  isActive: z.boolean(),
  isSticky: z.boolean(),
  publishedAt: z.date().nullable(),
  categoryIds: z.array(z.string()),
  featuredImageId: z.number().nullable(),
  featuredImageFile: z.any().nullable()
});

export type PostFormValues = z.infer<typeof postFormSchema>;
