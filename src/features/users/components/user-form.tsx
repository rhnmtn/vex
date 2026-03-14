'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormMediaPicker } from '@/components/forms/form-media-picker';
import { FormSelect } from '@/components/forms/form-select';
import { FormSwitch } from '@/components/forms/form-switch';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import type { UserWithAvatar } from '@/features/users/actions/get-user-by-id';
import { createUser } from '@/features/users/actions/create-user';
import { updateUserPassword } from '@/features/users/actions/update-password';
import { updateUserWithAvatar } from '@/features/users/actions/update-user-with-avatar';
import {
  userCreateSchema,
  userUpdateSchema,
  type UserCreateInput,
  type UserUpdateInput
} from '@/features/users/schemas/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Yönetici' },
  { value: 'USER', label: 'Kullanıcı' },
  { value: 'GUEST', label: 'Misafir' }
];

export type UserFormData = UserWithAvatar | null;

const USER_FORM_INFO =
  'E-posta ve şifre zorunludur. Rol ataması yapabilirsiniz. Profil görseli opsiyoneldir.';

interface UserFormProps {
  initialData: UserFormData;
  pageTitle: string;
  pageDescription?: string;
}

export default function UserForm({
  initialData,
  pageTitle,
  pageDescription = USER_FORM_INFO
}: UserFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const form = useForm<UserCreateInput | UserUpdateInput>({
    resolver: zodResolver(isEdit ? userUpdateSchema : userCreateSchema),
    defaultValues: isEdit
      ? {
          email: initialData!.email ?? '',
          name: initialData!.name ?? '',
          title: initialData!.title ?? null,
          phone: initialData!.phone ?? null,
          role: (initialData!.role as UserUpdateInput['role']) ?? null,
          isActive: initialData!.isActive ?? true,
          avatarMediaId: initialData!.avatarMediaId ?? null,
          avatarFile: null,
          password: '',
          passwordConfirm: ''
        }
      : {
          email: '',
          password: '',
          passwordConfirm: '',
          name: '',
          title: null,
          phone: null,
          role: 'USER',
          isActive: true,
          avatarMediaId: null,
          avatarFile: null
        }
  });

  const existingAvatarMedia =
    initialData?.avatarMediaId && initialData?.avatarPath
      ? {
          id: initialData.avatarMediaId,
          path: initialData.avatarPath,
          filename: undefined,
          size: undefined
        }
      : null;

  async function onSubmit(values: UserCreateInput | UserUpdateInput) {
    const formData = new FormData();
    formData.set('name', values.name.trim());
    formData.set('title', (values.title ?? '').toString());
    formData.set('phone', (values.phone ?? '').toString());
    formData.set('role', (values.role ?? '').toString());
    formData.set('isActive', String(values.isActive));

    if (isEdit) {
      const hadAvatar = !!initialData?.avatarMediaId;
      const hasAvatarNow =
        !!values.avatarMediaId ||
        !!(values.avatarFile && values.avatarFile instanceof File);
      const avatarRemoved = hadAvatar && !hasAvatarNow;
      formData.set('avatarRemoved', String(avatarRemoved));

      if (values.avatarFile && values.avatarFile instanceof File) {
        formData.set('avatarFile', values.avatarFile);
      }

      if (!initialData?.id) {
        toast.error('Kullanıcı bulunamadı.');
        return;
      }

      const result = await updateUserWithAvatar(initialData.id, formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const newPassword = (values as UserUpdateInput).password?.trim();
      if (newPassword) {
        const pwdResult = await updateUserPassword(initialData.id, newPassword);
        if (!pwdResult.success) {
          toast.error(pwdResult.error);
          return;
        }
      }

      toast.success('Kullanıcı güncellendi.');
      router.push('/dashboard/users');
      router.refresh();
      return;
    }

    // Create
    const createValues = values as UserCreateInput;
    formData.set('email', createValues.email.trim());
    formData.set('password', createValues.password);
    if (createValues.avatarFile && createValues.avatarFile instanceof File) {
      formData.set('avatarFile', createValues.avatarFile);
    }

    const result = await createUser(formData);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Kullanıcı oluşturuldu.');
    router.push('/dashboard/users');
    router.refresh();
  }

  const isPending = form.formState.isSubmitting;

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
        <CardDescription className='text-left'>
          {pageDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          <FormMediaPicker
            control={form.control}
            name='avatarMediaId'
            fileFieldName='avatarFile'
            label='Profil Görseli'
            description='Avatar olarak kullanılacak görsel (opsiyonel)'
            existingMedia={existingAvatarMedia}
            disabled={isPending}
            config={{
              maxSize: 5 * 1024 * 1024,
              aspectRatio: 'square'
            }}
          />

          <div className='w-full'>
            <FormInput
              control={form.control}
              name='name'
              label='Ad Soyad'
              placeholder='Ad Soyad'
              required
              disabled={isPending}
            />
          </div>

          <FormInput
            control={form.control}
            name='title'
            label='Ünvan'
            placeholder='Ünvan (opsiyonel)'
            disabled={isPending}
          />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='email'
              label='E-posta'
              type='email'
              placeholder='ornek@firma.com'
              required={!isEdit}
              disabled={isEdit}
            />
            <FormInput
              control={form.control}
              name='phone'
              label='Telefon'
              placeholder='Telefon (opsiyonel)'
              type='tel'
              disabled={isPending}
            />
            <FormSelect
              control={form.control}
              name='role'
              label='Rol'
              placeholder='Rol seçin'
              options={ROLE_OPTIONS}
              disabled={isPending}
            />
          </div>

          <div className='space-y-6 border-t pt-6'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                {isEdit ? 'Şifre Değiştir' : 'Giriş Bilgileri'}
              </p>
              {isEdit && (
                <p className='text-muted-foreground mt-1 text-xs'>
                  Değiştirmek istemiyorsanız boş bırakın
                </p>
              )}
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormInput
                control={form.control}
                name='password'
                label='Şifre'
                type='password'
                placeholder={
                  isEdit
                    ? 'Değiştirmek için yeni şifre (opsiyonel)'
                    : 'En az 6 karakter'
                }
                required={!isEdit}
                disabled={isPending}
              />
              <FormInput
                control={form.control}
                name='passwordConfirm'
                label='Şifre Tekrar'
                type='password'
                placeholder={
                  isEdit
                    ? 'Yeni şifreyi tekrar giriniz'
                    : 'Şifreyi tekrar giriniz'
                }
                required={!isEdit}
                disabled={isPending}
              />
            </div>
          </div>

          <div className='border-t pt-6'>
            <FormSwitch
              control={form.control}
              name='isActive'
              label='Aktif'
              description='Pasif kullanıcılar giriş yapamaz'
              disabled={isPending}
            />
          </div>

          <div className='flex gap-4'>
            <Button type='submit' disabled={isPending}>
              {isPending
                ? isEdit
                  ? 'Kaydediliyor...'
                  : 'Oluşturuluyor...'
                : isEdit
                  ? 'Kaydet'
                  : 'Oluştur'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.back()}
              disabled={isPending}
            >
              İptal
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
