import { getUsers } from '@/features/users/actions/get-users';
import { searchParamsCache } from '@/lib/searchparams';
import { UserTable, columns } from './user-tables';

export default async function UserListingPage() {
  const page = searchParamsCache.get('page');
  const perPage = searchParamsCache.get('perPage');
  const name = searchParamsCache.get('name');
  const role = searchParamsCache.get('role');

  const { users, total } = await getUsers({
    page,
    limit: perPage,
    ...(name && { name }),
    ...(role && { role })
  });

  return (
    <UserTable data={users} totalItems={total} columns={columns} />
  );
}
