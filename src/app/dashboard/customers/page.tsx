import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import CustomerListingPage from '@/features/customers/components/customer-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { customersInfoContent } from '@/config/infoconfig';

export const metadata = {
  title: 'Dashboard: Müşteriler'
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
      pageTitle='Müşteriler'
      pageDescription='Müşteri listesini yönetin. Ekleme, düzenleme ve silme işlemleri.'
      infoContent={customersInfoContent}
      pageHeaderAction={
        <Link
          href='/dashboard/customers/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <IconPlus className='mr-2 h-4 w-4' /> Yeni Ekle
        </Link>
      }
    >
      <Suspense
        fallback={
          <DataTableSkeleton columnCount={7} rowCount={8} filterCount={2} />
        }
      >
        <CustomerListingPage />
      </Suspense>
    </PageContainer>
  );
}
