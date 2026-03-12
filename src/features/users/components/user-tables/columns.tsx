'use client';

import { Badge } from '@/components/ui/badge';
import {
  createActionsColumn,
  createImageColumn,
  createStatusColumn
} from '@/components/ui/table/column-helpers';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { UserRow } from '@/features/users/actions/get-users';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import Link from 'next/link';
import { CellAction } from './cell-action';
import { ROLE_OPTIONS } from './options';

export const columns: ColumnDef<UserRow>[] = [
  createImageColumn<UserRow>({
    imagePathKey: 'avatarPath',
    fallbackKey: 'name',
    variant: 'avatar',
    id: 'avatar'
  }),
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<UserRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ad Soyad' />
    ),
    cell: ({ row }) => (
      <Link
        href={`/dashboard/users/${row.original.id}`}
        className='font-medium hover:underline'
      >
        {row.original.name}
      </Link>
    ),
    meta: {
      label: 'Ad Soyad',
      placeholder: 'Ad ile ara...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'email',
    header: 'E-posta'
  },
  {
    accessorKey: 'title',
    header: 'Ünvan'
  },
  {
    accessorKey: 'role',
    header: ({ column }: { column: Column<UserRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Rol' />
    ),
    cell: ({ cell }) => {
      const role = cell.getValue<string | null>();
      return role ? (
        <Badge variant='outline' className='capitalize'>
          {ROLE_OPTIONS.find((o) => o.value === role)?.label ?? role}
        </Badge>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    },
    meta: {
      label: 'Rol',
      variant: 'select',
      options: ROLE_OPTIONS
    },
    enableColumnFilter: true
  },
  createStatusColumn<UserRow>(),
  createActionsColumn<UserRow>(CellAction)
];
