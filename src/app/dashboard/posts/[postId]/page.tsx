import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import PostViewPage from '@/features/posts/components/post-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Yazı'
};

type PageProps = { params: Promise<{ postId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <PostViewPage postId={params.postId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
