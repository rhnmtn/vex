'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { UserRow } from '@/features/users/actions/get-users';
import { IconDotsVertical, IconEdit } from '@tabler/icons-react';
import Link from 'next/link';

interface CellActionProps {
  data: UserRow;
}

export function CellAction({ data }: CellActionProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Menüyü aç</span>
          <IconDotsVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/users/${data.id}`}>
            <IconEdit className='mr-2 h-4 w-4' /> Düzenle
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
