'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { changePassword } from '@/features/profile/actions/change-password';
import {
  passwordFormSchema,
  type PasswordFormValues
} from '@/features/profile/schemas/password-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const PASSWORD_FORM_INFO =
  'Mevcut şifrenizi girip yeni şifrenizi belirleyin. Şifre en az 6 karakter olmalıdır.';

export default function PasswordForm() {
  const router = useRouter();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    }
  });

  async function onSubmit(values: PasswordFormValues) {
    const result = await changePassword(
      values.currentPassword,
      values.newPassword
    );

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Şifre güncellendi');
    form.reset();
    router.push('/dashboard/overview');
    router.refresh();
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Şifre Değiştir
        </CardTitle>
        <CardDescription className='text-left'>
          {PASSWORD_FORM_INFO}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          <FormInput
            control={form.control}
            name='currentPassword'
            label='Mevcut Şifre'
            type='password'
            placeholder='Mevcut şifrenizi giriniz'
            required
            disabled={form.formState.isSubmitting}
          />

          <FormInput
            control={form.control}
            name='newPassword'
            label='Yeni Şifre'
            type='password'
            placeholder='En az 6 karakter'
            required
            disabled={form.formState.isSubmitting}
          />

          <FormInput
            control={form.control}
            name='newPasswordConfirm'
            label='Yeni Şifre Tekrar'
            type='password'
            placeholder='Yeni şifreyi tekrar giriniz'
            required
            disabled={form.formState.isSubmitting}
          />

          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Güncelleniyor...'
              : 'Şifreyi Güncelle'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
