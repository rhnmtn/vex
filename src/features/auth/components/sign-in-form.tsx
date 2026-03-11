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
import { signInSchema, type SignInInput } from '@/features/auth/schemas/sign-in';
import { getSafeRedirectUrl } from '@/features/auth/utils/safe-redirect';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';

const CALLBACK_URL = '/dashboard';

export function SignInForm() {
  const router = useRouter();
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignInInput) {
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: CALLBACK_URL,
    });

    if (error) {
      toast.error(error.message ?? 'Giriş yapılamadı');
      return;
    }

    const safeUrl = getSafeRedirectUrl(data?.url);
    if (safeUrl) {
      window.location.href = safeUrl;
    } else {
      router.push(CALLBACK_URL);
    }
  }

  const isPending = form.formState.isSubmitting;

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Giriş Yap</CardTitle>
        <CardDescription>Hesabınıza giriş yapın</CardDescription>
      </CardHeader>
      <Form
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className='contents'
      >
        <CardContent className='space-y-4'>
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
            placeholder='••••••••'
            required
            disabled={isPending}
          />
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
          <p className='text-center text-sm text-muted-foreground'>
            Hesabınız yok mu?{' '}
            <Link href='/auth/sign-up' className='underline hover:text-primary'>
              Kayıt olun
            </Link>
          </p>
        </CardFooter>
      </Form>
    </Card>
  );
}
