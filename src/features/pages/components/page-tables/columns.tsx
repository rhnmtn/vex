'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import {
  createActionsColumn,
  createStatusColumn
} from '@/components/ui/table/column-helpers';
import type { PageRow } from '@/features/pages/actions/get-pages';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export type { PageRow };

export const columns: ColumnDef<PageRow>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }: { column: Column<PageRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Başlık' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<PageRow['title']>()}</div>,
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
  createStatusColumn<PageRow>(),
  createActionsColumn<PageRow>(CellAction)
];
