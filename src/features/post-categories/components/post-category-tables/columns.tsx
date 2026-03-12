'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import {
  createActionsColumn,
  createImageColumn,
  createStatusColumn
} from '@/components/ui/table/column-helpers';
import type { PostCategoryRow } from '@/features/post-categories/actions/get-post-categories';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export type { PostCategoryRow };

export const columns: ColumnDef<PostCategoryRow>[] = [
  createImageColumn<PostCategoryRow>({
    imagePathKey: 'bannerImagePath',
    fallbackKey: 'name',
    id: 'image'
  }),
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
  createStatusColumn<PostCategoryRow>(),
  createActionsColumn<PostCategoryRow>(CellAction)
];
