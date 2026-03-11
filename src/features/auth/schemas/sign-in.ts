import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gerekli')
    .email('Geçerli bir e-posta adresi girin')
    .max(255, 'E-posta adresi çok uzun'),
  password: z.string().min(1, 'Şifre gerekli').max(128, 'Şifre çok uzun'),
});

export type SignInInput = z.infer<typeof signInSchema>;
