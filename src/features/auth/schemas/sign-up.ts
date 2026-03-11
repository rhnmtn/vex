import { z } from 'zod';

const MAX_NAME_LENGTH = 255;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, 'Ad gerekli')
    .max(MAX_NAME_LENGTH, `Ad en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
  email: z
    .string()
    .min(1, 'E-posta adresi gerekli')
    .email('Geçerli bir e-posta adresi girin')
    .max(255, 'E-posta adresi çok uzun'),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır`)
    .max(MAX_PASSWORD_LENGTH, `Şifre en fazla ${MAX_PASSWORD_LENGTH} karakter olabilir`),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
