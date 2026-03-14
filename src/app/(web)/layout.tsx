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
      <a
        href='#main-content'
        className='bg-primary text-primary-foreground focus:ring-primary focus:ring-offset-background sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none'
      >
        İçeriğe atla
      </a>
      <PublicHeader company={company} menuItems={headerMenuItems} />
      <main id='main-content' className='w-full flex-1' role='main'>
        {children}
      </main>
      <PublicFooter company={company} menuItems={footerMenuItems} />
    </div>
  );
}
