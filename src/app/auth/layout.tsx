import { AuthLayoutPanel } from '@/features/auth/components/auth-layout-panel';
import { AuthPageLink } from '@/features/auth/components/auth-page-link';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className='relative flex min-h-svh flex-col overflow-hidden md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <AuthPageLink />
      <AuthLayoutPanel />
      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto'>
        {children}
      </div>
    </div>
  );
}
