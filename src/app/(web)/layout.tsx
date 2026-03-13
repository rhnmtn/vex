import { PublicFooter } from '@/components/layout/public-footer';
import { PublicHeader } from '@/components/layout/public-header';
import { getWebCompany } from '@/lib/web-company';

export default async function WebLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const company = await getWebCompany();

  return (
    <div className='flex min-h-screen flex-col'>
      <PublicHeader company={company} />
      <main className='w-full flex-1'>{children}</main>
      <PublicFooter company={company} />
    </div>
  );
}
