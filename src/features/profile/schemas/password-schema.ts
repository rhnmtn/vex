import * as z from 'zod';

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mevcut şifre giriniz'),
    newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalıdır'),
    newPasswordConfirm: z.string().min(1, 'Yeni şifreyi tekrar giriniz')
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: 'Şifreler eşleşmiyor',
    path: ['newPasswordConfirm']
  });

export type PasswordFormValues = z.infer<typeof passwordFormSchema>;
