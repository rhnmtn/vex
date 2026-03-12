'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import {
  createActionsColumn,
  createImageColumn,
  createStatusColumn
} from '@/components/ui/table/column-helpers';
import type { PostRow } from '@/features/posts/actions/get-posts';
import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export type { PostRow };

export const columns: ColumnDef<PostRow>[] = [
  createImageColumn<PostRow>({
    imagePathKey: 'featuredImagePath',
    fallbackKey: 'title',
    id: 'image'
  }),
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
  createStatusColumn<PostRow>(),
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
  createActionsColumn<PostRow>(CellAction)
];
