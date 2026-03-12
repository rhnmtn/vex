import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import PostCategoryListingPage from '@/features/post-categories/components/post-category-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { postCategoriesInfoContent } from '@/config/infoconfig';

export const metadata = {
  title: 'Dashboard: Blog Kategorileri'
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
      pageTitle='Blog Kategorileri'
      pageDescription='Blog yazı kategorilerini yönetin. Ekleme, düzenleme ve silme işlemleri.'
      infoContent={postCategoriesInfoContent}
      pageHeaderAction={
        <Link
          href='/dashboard/post-categories/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <IconPlus className='mr-2 h-4 w-4' /> Yeni Ekle
        </Link>
      }
    >
      <Suspense
        fallback={
          <DataTableSkeleton columnCount={4} rowCount={8} filterCount={2} />
        }
      >
        <PostCategoryListingPage />
      </Suspense>
    </PageContainer>
  );
}
