'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth-client';
import { signUpSchema, type SignUpInput } from '@/features/auth/schemas/sign-up';
import { getSafeRedirectUrl } from '@/features/auth/utils/safe-redirect';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';

const CALLBACK_URL = '/dashboard';

export function SignUpForm() {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignUpInput) {
    const { data, error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: CALLBACK_URL,
    });

    if (error) {
      toast.error(error.message ?? 'Kayıt oluşturulamadı');
      return;
    }

    const result = data as { redirect?: boolean; url?: string } | undefined;
    const safeUrl = getSafeRedirectUrl(result?.url);
    if (safeUrl) {
      setRedirectUrl(safeUrl);
    } else {
      router.push(CALLBACK_URL);
    }
  }

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  const isPending = form.formState.isSubmitting;

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Kayıt Ol</CardTitle>
        <CardDescription>Yeni bir hesap oluşturun</CardDescription>
      </CardHeader>
      <Form
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className='contents'
      >
        <CardContent className='space-y-4'>
          <FormInput
            control={form.control}
            name='name'
            label='Ad'
            type='text'
            placeholder='Adınız'
            required
            disabled={isPending}
          />
          <FormInput
            control={form.control}
            name='email'
            label='E-posta'
            type='email'
            placeholder='ornek@email.com'
            required
            disabled={isPending}
          />
          <FormInput
            control={form.control}
            name='password'
            label='Şifre'
            type='password'
            placeholder='En az 8 karakter'
            required
            disabled={isPending}
          />
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
          </Button>
          <p className='text-center text-sm text-muted-foreground'>
            Zaten hesabınız var mı?{' '}
            <Link href='/auth/sign-in' className='underline hover:text-primary'>
              Giriş yapın
            </Link>
          </p>
        </CardFooter>
      </Form>
    </Card>
  );
}
