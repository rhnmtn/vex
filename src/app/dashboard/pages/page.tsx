import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import PageListingPage from '@/features/pages/components/page-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { pagesInfoContent } from '@/config/infoconfig';

export const metadata = {
  title: 'Dashboard: Sayfalar'
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
      pageTitle='Sayfalar'
      pageDescription='Sayfa listesini yönetin. Başlık, görsel, içerik ve meta alanları.'
      infoContent={pagesInfoContent}
      pageHeaderAction={
        <Link
          href='/dashboard/pages/new'
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
        <PageListingPage />
      </Suspense>
    </PageContainer>
  );
}
