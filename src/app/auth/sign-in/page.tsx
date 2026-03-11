'use client';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authClient.signIn.email({
        email,
        password
      });
      if (result.error) {
        toast.error(result.error.message ?? 'Giriş başarısız');
        return;
      }
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      window.location.href = '/dashboard';
    } catch {
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto w-full max-w-sm'>
        <h2 className='text-foreground text-center text-2xl font-bold'>
          Giriş Yap
        </h2>
        <p className='text-muted-foreground mt-2 text-center text-sm'>
          Hesabınıza giriş yapın
        </p>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='email'>E-posta</Label>
              <Input
                id='email'
                type='email'
                autoComplete='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='mt-2'
              />
            </div>
            <div>
              <Label htmlFor='password'>Şifre</Label>
              <Input
                id='password'
                type='password'
                autoComplete='current-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='mt-2'
              />
            </div>
          </div>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
          <p className='text-muted-foreground text-center text-sm'>
            Hesabınız yok mu?{' '}
            <Link href='/auth/sign-up' className='text-primary hover:underline'>
              Kayıt olun
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
