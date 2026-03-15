import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import PageViewPage from '@/features/pages/components/page-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Sayfa'
};

type PageProps = { params: Promise<{ pageId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <PageViewPage pageId={params.pageId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
