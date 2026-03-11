import * as z from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

export const mediaUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_FILE_SIZE, 'Dosya boyutu en fazla 10MB olmalıdır.')
    .refine(
      (f) => ACCEPTED_TYPES.includes(f.type),
      'Sadece JPEG, PNG, WebP ve GIF formatları kabul edilir.'
    ),
  alt: z.string().max(255).optional()
});

export const mediaUpdateSchema = z.object({
  alt: z.string().max(255).optional()
});

export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;
export type MediaUpdateInput = z.infer<typeof mediaUpdateSchema>;
