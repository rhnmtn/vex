'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { UserRow } from '@/features/users/actions/get-users';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CellAction } from './cell-action';
import { ROLE_OPTIONS } from './options';

export const columns: ColumnDef<UserRow>[] = [
  {
    id: 'avatar',
    header: '',
    cell: ({ row }) => {
      const avatarPath = row.original.avatarPath;
      const name = row.original.name;
      if (avatarPath) {
        return (
          <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full'>
            <Image
              src={avatarPath}
              alt={name}
              fill
              className='object-cover'
              sizes='40px'
            />
          </div>
        );
      }
      return (
        <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium'>
          {name.charAt(0).toUpperCase()}
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<UserRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ad Soyad' />
    ),
    cell: ({ row }) => (
      <Link
        href={`/dashboard/users/${row.original.id}`}
        className='hover:underline font-medium'
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
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: ({ column }: { column: Column<UserRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Durum' />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<boolean>();
      const Icon = isActive ? CheckCircle2 : XCircle;
      return (
        <Badge variant='outline' className='capitalize'>
          <Icon className='mr-1 h-3 w-3' />
          {isActive ? 'Aktif' : 'Pasif'}
        </Badge>
      );
    },
    meta: {
      label: 'Durum',
      variant: 'select',
      options: [
        { value: 'true', label: 'Aktif' },
        { value: 'false', label: 'Pasif' }
      ]
    },
    enableColumnFilter: true
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
