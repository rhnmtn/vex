import type { Table } from '@tanstack/react-table';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1.5 overflow-auto p-1 text-xs',
        className
      )}
      {...props}
    >
      <span className='whitespace-nowrap'>
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <>
            {table.getFilteredSelectedRowModel().rows.length} /{' '}
            {table.getFilteredRowModel().rows.length} seçili
          </>
        ) : (
          <>{table.getFilteredRowModel().rows.length} kayıt</>
        )}
      </span>
      <div className='flex items-center gap-x-3'>
        <div className='flex items-center gap-x-1.5'>
          <span className='whitespace-nowrap'>Sayfa başına</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-6 min-w-14 text-xs [&[data-size]]:h-6'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className='whitespace-nowrap'>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <div className='flex items-center gap-x-0.5'>
          <Button
            aria-label='İlk sayfa'
            variant='outline'
            size='icon'
            className='hidden h-6 w-6 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className='h-3 w-3' />
          </Button>
          <Button
            aria-label='Önceki sayfa'
            variant='outline'
            size='icon'
            className='h-6 w-6'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className='h-3 w-3' />
          </Button>
          <Button
            aria-label='Sonraki sayfa'
            variant='outline'
            size='icon'
            className='h-6 w-6'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className='h-3 w-3' />
          </Button>
          <Button
            aria-label='Son sayfa'
            variant='outline'
            size='icon'
            className='hidden h-6 w-6 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className='h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  );
}
