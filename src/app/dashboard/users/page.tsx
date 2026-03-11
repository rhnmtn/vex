import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import UserListingPage from '@/features/users/components/user-listing';
import { usersInfoContent } from '@/config/infoconfig';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Kullanıcılar'
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
      pageTitle='Kullanıcılar'
      pageDescription='Şirket kullanıcılarını yönetin'
      infoContent={usersInfoContent}
      pageHeaderAction={
        <Link
          href='/dashboard/users/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <IconPlus className='mr-2 h-4 w-4' /> Yeni Ekle
        </Link>
      }
    >
      <Suspense
        fallback={
          <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
        }
      >
        <UserListingPage />
      </Suspense>
    </PageContainer>
  );
}
