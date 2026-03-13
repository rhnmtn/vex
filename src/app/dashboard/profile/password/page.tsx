import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import PasswordForm from '@/features/profile/components/password-form';
import Link from 'next/link';
import { Suspense } from 'react';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'Dashboard: Şifre Değiştir',
  description: 'Hesap şifrenizi değiştirin'
};

export default async function PasswordPage() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-6'>
        <div className='flex items-center justify-between'>
          <Link
            href='/dashboard/profile'
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            ← Profil
          </Link>
        </div>
        <Suspense fallback={<FormCardSkeleton />}>
          <PasswordForm />
        </Suspense>
      </div>
    </PageContainer>
  );
}
