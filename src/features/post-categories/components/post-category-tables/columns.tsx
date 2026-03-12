'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { PostCategoryRow } from '@/features/post-categories/actions/get-post-categories';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';

export type { PostCategoryRow };

export const columns: ColumnDef<PostCategoryRow>[] = [
  {
    id: 'image',
    header: '',
    cell: ({ row }) => {
      const bannerImagePath = row.original.bannerImagePath;
      const name = row.original.name;
      if (bannerImagePath) {
        return (
          <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-md'>
            <Image
              src={bannerImagePath}
              alt={name}
              fill
              className='object-cover'
              sizes='40px'
            />
          </div>
        );
      }
      return (
        <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xs font-medium text-muted-foreground'>
          —
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<PostCategoryRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Kategori Adı' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<PostCategoryRow['name']>()}</div>,
    meta: {
      label: 'Kategori Adı',
      placeholder: 'Kategori adı veya slug ile ara...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'slug',
    header: 'Slug'
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: ({ column }: { column: Column<PostCategoryRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Durum' />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<PostCategoryRow['isActive']>();
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
