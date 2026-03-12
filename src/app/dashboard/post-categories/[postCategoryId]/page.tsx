import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import PostCategoryViewPage from '@/features/post-categories/components/post-category-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Blog Kategorisi'
};

type PageProps = { params: Promise<{ postCategoryId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <PostCategoryViewPage postCategoryId={params.postCategoryId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
