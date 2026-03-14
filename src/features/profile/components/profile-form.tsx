'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormMediaPicker } from '@/components/forms/form-media-picker';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { updateProfile } from '@/features/profile/actions/update-profile';
import {
  profileFormSchema,
  type ProfileFormValues
} from '@/features/profile/schemas/profile-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export type ProfileFormData = {
  id: string;
  name: string;
  email: string;
  title: string | null;
  phone: string | null;
  avatarMediaId: number | null;
  avatarPath?: string | null;
} | null;

const PROFILE_FORM_INFO =
  'Ad, ünvan ve iletişim bilgilerinizi güncelleyebilirsiniz. E-posta değiştirilemez.';

interface ProfileFormProps {
  initialData: ProfileFormData;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();

  const defaultValues: ProfileFormValues = {
    name: initialData?.name ?? '',
    title: initialData?.title ?? '',
    phone: initialData?.phone ?? '',
    avatarMediaId: initialData?.avatarMediaId ?? null,
    avatarFile: null
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues
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

  async function onSubmit(values: ProfileFormValues) {
    const formData = new FormData();
    formData.set('name', values.name.trim());
    formData.set('title', (values.title ?? '').toString());
    formData.set('phone', (values.phone ?? '').toString());

    const hadAvatar = !!initialData?.avatarMediaId;
    const hasAvatarNow =
      !!values.avatarMediaId ||
      !!(values.avatarFile && values.avatarFile instanceof File);
    const avatarRemoved = hadAvatar && !hasAvatarNow;
    formData.set('avatarRemoved', String(avatarRemoved));

    if (values.avatarFile && values.avatarFile instanceof File) {
      formData.set('avatarFile', values.avatarFile);
    }

    const result = await updateProfile(formData);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Profil güncellendi');
    router.push('/dashboard/overview');
    router.refresh();
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Profil Bilgileri
        </CardTitle>
        <CardDescription className='text-left'>
          {PROFILE_FORM_INFO}
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
            disabled={form.formState.isSubmitting}
            config={{
              maxSize: 5 * 1024 * 1024,
              aspectRatio: 'square'
            }}
          />

          <FormInput
            control={form.control}
            name='name'
            label='Ad Soyad'
            placeholder='Ad Soyad'
            required
            disabled={form.formState.isSubmitting}
          />

          <FormInput
            control={form.control}
            name='title'
            label='Ünvan'
            placeholder='Ünvan (opsiyonel)'
            disabled={form.formState.isSubmitting}
          />

          <FormInput
            control={form.control}
            name='phone'
            label='Telefon'
            placeholder='Telefon (opsiyonel)'
            type='tel'
            disabled={form.formState.isSubmitting}
          />

          <div className='space-y-1'>
            <div className='text-muted-foreground rounded-md border px-3 py-2 text-sm'>
              <span className='font-medium'>E-posta:</span>{' '}
              {initialData?.email ?? '—'}
            </div>
            <p className='text-muted-foreground text-xs'>
              E-posta adresi güvenlik nedeniyle değiştirilemez.
            </p>
          </div>

          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
