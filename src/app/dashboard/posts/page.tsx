import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import PostListingPage from '@/features/posts/components/post-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { postsInfoContent } from '@/config/infoconfig';

export const metadata = {
  title: 'Dashboard: Bloglar'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Bloglar'
      pageDescription='Blog yazılarınızı yönetin. Ekleme, düzenleme ve silme işlemleri.'
      infoContent={postsInfoContent}
      pageHeaderAction={
        <Link
          href='/dashboard/posts/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <IconPlus className='mr-2 h-4 w-4' /> Yeni Ekle
        </Link>
      }
    >
      <Suspense
        fallback={
          <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
        }
      >
        <PostListingPage />
      </Suspense>
    </PageContainer>
  );
}
