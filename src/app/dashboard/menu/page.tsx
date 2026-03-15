import PageContainer from '@/components/layout/page-container';
import { MenuTab } from '@/features/company/components/menu-tab';
import { getCompanyByUser } from '@/features/company/actions/get-company-by-user';
import {
  getFooterMenuItems,
  getHeaderMenuItems
} from '@/features/company/actions/menu-actions';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Dashboard: Menü Bilgileri',
  description: 'Header ve footer menü öğelerinizi yönetin'
};

export default async function MenuPage() {
  const [company, headerItems, footerItems] = await Promise.all([
    getCompanyByUser(),
    getHeaderMenuItems(),
    getFooterMenuItems()
  ]);

  if (!company) {
    notFound();
  }

  return (
    <PageContainer
      scrollable
      pageTitle='Menü Bilgileri'
      pageDescription='Web sitenizin header ve footer menü öğelerini buradan yönetebilirsiniz.'
    >
      <div className='flex-1 space-y-4'>
        <div className='bg-card rounded-lg border p-6'>
          <MenuTab headerItems={headerItems} footerItems={footerItems} />
        </div>
      </div>
    </PageContainer>
  );
}
