import { PublicFooter } from '@/components/layout/public-footer';
import { PublicHeader } from '@/components/layout/public-header';
import {
  getWebCompany,
  getWebFooterMenuItems,
  getWebHeaderMenuItems
} from '@/lib/web-company';

export default async function WebLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [company, headerMenuItems, footerMenuItems] = await Promise.all([
    getWebCompany(),
    getWebHeaderMenuItems(),
    getWebFooterMenuItems()
  ]);

  return (
    <div className='flex min-h-screen flex-col'>
      <PublicHeader company={company} menuItems={headerMenuItems} />
      <main className='w-full flex-1'>{children}</main>
      <PublicFooter company={company} menuItems={footerMenuItems} />
    </div>
  );
}
