'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import {
  createActionsColumn,
  createStatusColumn
} from '@/components/ui/table/column-helpers';
import type { CustomerRow } from '@/features/customers/actions/get-customers';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export type { CustomerRow };

export const columns: ColumnDef<CustomerRow>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<CustomerRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Firma Adı' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<CustomerRow['name']>()}</div>,
    meta: {
      label: 'Firma Adı',
      placeholder: 'Firma adı veya e-posta ile ara...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'contactName',
    header: 'Yetkili'
  },
  {
    accessorKey: 'email',
    header: 'E-posta'
  },
  {
    accessorKey: 'mobile',
    header: 'Telefon'
  },
  {
    accessorKey: 'city',
    header: 'Şehir'
  },
  {
    accessorKey: 'taxNumber',
    header: 'Vergi No'
  },
  createStatusColumn<CustomerRow>(),
  createActionsColumn<CustomerRow>(CellAction)
];
