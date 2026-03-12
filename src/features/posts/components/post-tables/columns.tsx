'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { PostRow } from '@/features/posts/actions/get-posts';
import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';

export type { PostRow };

export const columns: ColumnDef<PostRow>[] = [
  {
    id: 'image',
    header: '',
    cell: ({ row }) => {
      const featuredImagePath = row.original.featuredImagePath;
      const title = row.original.title;
      if (featuredImagePath) {
        return (
          <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-md'>
            <Image
              src={featuredImagePath}
              alt={title}
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
    id: 'title',
    accessorKey: 'title',
    header: ({ column }: { column: Column<PostRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Başlık' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<PostRow['title']>()}</div>,
    meta: {
      label: 'Başlık',
      placeholder: 'Başlık veya slug ile ara...',
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
    header: ({ column }: { column: Column<PostRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Durum' />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<PostRow['isActive']>();
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
    id: 'publishedAt',
    accessorKey: 'publishedAt',
    header: ({ column }: { column: Column<PostRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Yayın Tarihi' />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<PostRow['publishedAt']>();
      return date ? (
        <span>{format(date, 'd MMM yyyy', { locale: tr })}</span>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
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
