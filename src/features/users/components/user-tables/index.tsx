'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import type { UserRow } from '@/features/users/actions/get-users';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { columns } from './columns';

interface UserTableParams {
  data: UserRow[];
  totalItems: number;
  columns: ColumnDef<UserRow, unknown>[];
}

export function UserTable({
  data,
  totalItems,
  columns: cols
}: UserTableParams) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns: cols,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

export { columns };
