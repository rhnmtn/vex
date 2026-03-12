'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Column } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

const STATUS_OPTIONS = [
  { value: 'true', label: 'Aktif' },
  { value: 'false', label: 'Pasif' }
] as const;

/** isActive kolonu için factory */
export function createStatusColumn<T extends { isActive: boolean }>(
  title = 'Durum'
): ColumnDef<T, boolean> {
  return {
    id: 'isActive',
    accessorKey: 'isActive',
    header: ({ column }: { column: Column<T, unknown> }) => (
      <DataTableColumnHeader column={column} title={title} />
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
    enableColumnFilter: true,
    meta: {
      label: title,
      variant: 'select',
      options: [...STATUS_OPTIONS]
    }
  };
}

type ImageColumnConfig<T> = {
  imagePathKey: keyof T;
  fallbackKey: keyof T;
  variant?: 'avatar' | 'image';
  id?: string;
};

/** Görsel kolonu için factory (avatar veya image) */
export function createImageColumn<T extends Record<string, unknown>>(
  config: ImageColumnConfig<T>
): ColumnDef<T> {
  const { imagePathKey, fallbackKey, variant = 'image', id } = config;
  const isAvatar = variant === 'avatar';

  return {
    id: id ?? String(imagePathKey),
    header: '',
    cell: ({ row }) => {
      const imagePath = row.original[imagePathKey] as string | null | undefined;
      const fallbackValue = row.original[fallbackKey] as string | undefined;

      if (imagePath) {
        return (
          <div
            className={
              isAvatar
                ? 'relative h-10 w-10 shrink-0 overflow-hidden rounded-full'
                : 'relative h-10 w-10 shrink-0 overflow-hidden rounded-md'
            }
          >
            <Image
              src={imagePath}
              alt={String(fallbackValue ?? '')}
              fill
              className='object-cover'
              sizes='40px'
            />
          </div>
        );
      }

      if (isAvatar && fallbackValue) {
        return (
          <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium'>
            {fallbackValue.charAt(0).toUpperCase()}
          </div>
        );
      }

      return (
        <div className='bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xs font-medium'>
          —
        </div>
      );
    }
  };
}

/** Actions kolonu için factory */
export function createActionsColumn<T>(
  CellActionComponent: React.ComponentType<{ data: T }>
): ColumnDef<T> {
  return {
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <CellActionComponent data={row.original} />
      </div>
    )
  };
}
