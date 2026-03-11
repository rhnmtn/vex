import * as z from 'zod';

export const userUpdateSchema = z.object({
  email: z.string().email().optional(), // sadece gösterim, güncellenmez
  name: z.string().min(1, 'Ad gerekli').max(255),
  title: z.string().max(255).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  role: z.enum(['ADMIN', 'MANAGER', 'USER', 'GUEST']).optional().nullable(),
  isActive: z.boolean(),
  avatarMediaId: z.number().int().positive().nullable().optional(),
  avatarFile: z.instanceof(File).nullable().optional()
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export const userCreateSchema = z
  .object({
    email: z.string().email('Geçerli e-posta giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    passwordConfirm: z.string().min(1, 'Şifre tekrarı giriniz'),
    name: z.string().min(1, 'Ad gerekli').max(255),
    title: z.string().max(255).optional().nullable(),
    phone: z.string().max(20).optional().nullable(),
    role: z.enum(['ADMIN', 'MANAGER', 'USER', 'GUEST']).optional().nullable(),
    isActive: z.boolean(),
    avatarMediaId: z.number().int().positive().nullable().optional(),
    avatarFile: z.instanceof(File).nullable().optional()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Şifreler eşleşmiyor',
    path: ['passwordConfirm']
  });

export type UserCreateInput = z.infer<typeof userCreateSchema>;
