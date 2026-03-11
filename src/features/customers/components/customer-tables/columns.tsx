'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { CustomerRow } from '@/features/customers/actions/get-customers';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
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
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: ({ column }: { column: Column<CustomerRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Durum' />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<CustomerRow['isActive']>();
      const Icon = isActive ? CheckCircle2 : XCircle;
      return (
        <Badge variant='outline' className='capitalize'>
          <Icon className='mr-1 h-3 w-3' />
          {isActive ? 'Aktif' : 'Pasif'}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Durum',
      variant: 'select',
      options: [
        { value: 'true', label: 'Aktif' },
        { value: 'false', label: 'Pasif' }
      ]
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <CellAction data={row.original} />
      </div>
    )
  }
];
