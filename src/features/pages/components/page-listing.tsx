import { getPages, type PageRow } from '@/features/pages/actions/get-pages';
import { searchParamsCache } from '@/lib/searchparams';
import { PageTable } from './page-tables';
import { columns } from './page-tables/columns';

export default async function PageListingPage() {
  const page = searchParamsCache.get('page');
  const title = searchParamsCache.get('title');
  const perPage = searchParamsCache.get('perPage');

  const { pages: pageList, total } = await getPages({
    page: page ?? 1,
    limit: perPage ?? 10,
    ...(title && { title })
  });

  return (
    <PageTable<PageRow, unknown>
      data={pageList}
      totalItems={total}
      columns={columns}
    />
  );
}
