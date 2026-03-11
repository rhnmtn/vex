import {
  getCustomers,
  type CustomerRow
} from '@/features/customers/actions/get-customers';
import { searchParamsCache } from '@/lib/searchparams';
import { CustomerTable } from './customer-tables';
import { columns } from './customer-tables/columns';

export default async function CustomerListingPage() {
  const page = searchParamsCache.get('page');
  const name = searchParamsCache.get('name');
  const perPage = searchParamsCache.get('perPage');

  const { customers, total } = await getCustomers({
    page: page ?? 1,
    limit: perPage ?? 10,
    ...(name && { name })
  });

  return (
    <CustomerTable<CustomerRow, unknown>
      data={customers}
      totalItems={total}
      columns={columns}
    />
  );
}
