import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import CompanyViewPage from '@/features/company/components/company-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Şirket Bilgileri',
  description: 'Şirket bilgilerinizi görüntüleyin ve düzenleyin'
};

export default async function CompanyPage() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <CompanyViewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
