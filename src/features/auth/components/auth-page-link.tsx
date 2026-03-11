'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AuthPageLink() {
  const pathname = usePathname();
  const isSignIn = pathname?.includes('/sign-in');

  return (
    <Link
      href={isSignIn ? '/auth/sign-up' : '/auth/sign-in'}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'absolute top-4 right-4 md:top-8 md:right-8'
      )}
    >
      {isSignIn ? 'Kayıt Ol' : 'Giriş Yap'}
    </Link>
  );
}
