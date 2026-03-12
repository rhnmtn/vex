import { PublicFooter } from '@/components/layout/public-footer';
import { PublicHeader } from '@/components/layout/public-header';

export default function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <PublicHeader />
      <main className='w-full flex-1'>{children}</main>
      <PublicFooter />
    </div>
  );
}
