'use client';

import { createActionsColumn } from '@/components/ui/table/column-helpers';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { MIME_TYPE_OPTIONS } from './options';
import type { MediaRow } from '@/features/media/actions/get-media';
import { formatBytes } from '@/lib/utils';

export const columns: ColumnDef<MediaRow>[] = [
  {
    id: 'preview',
    header: 'Önizleme',
    cell: ({ row }) => {
      const mime = row.original.mimeType;
      const path = row.original.path;
      const alt = row.original.alt ?? row.original.filename;

      if (mime.startsWith('image/')) {
        return (
          <div className='relative aspect-square h-12 w-12 shrink-0 overflow-hidden rounded-md'>
            <Image
              src={path}
              alt={alt}
              fill
              className='object-cover'
              sizes='48px'
            />
          </div>
        );
      }
      return (
        <div className='bg-muted flex h-12 w-12 items-center justify-center rounded-md text-xs'>
          Dosya
        </div>
      );
    }
  },
  {
    id: 'filename',
    accessorKey: 'filename',
    header: ({ column }: { column: Column<MediaRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Dosya Adı' />
    ),
    cell: ({ cell }) => (
      <div className='max-w-[200px] truncate' title={cell.getValue<string>()}>
        {cell.getValue<string>()}
      </div>
    ),
    meta: {
      label: 'Dosya adı',
      placeholder: 'Dosya adı ile ara...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'mimeType',
    accessorKey: 'mimeType',
    header: ({ column }: { column: Column<MediaRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Format' />
    ),
    cell: ({ cell }) => cell.getValue<string>(),
    meta: {
      label: 'Format',
      variant: 'select',
      options: MIME_TYPE_OPTIONS
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'size',
    header: 'Boyut',
    cell: ({ cell }) => formatBytes(cell.getValue<number>())
  },
  {
    accessorKey: 'alt',
    header: 'Alt Metin',
    cell: ({ cell }) => {
      const val = cell.getValue<string | null>();
      return val ? (
        <span className='max-w-[150px] truncate' title={val}>
          {val}
        </span>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    }
  },
  createActionsColumn<MediaRow>(CellAction)
];
