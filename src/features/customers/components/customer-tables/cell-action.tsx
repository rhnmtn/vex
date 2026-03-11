'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { CustomerRow } from '@/features/customers/actions/get-customers';
import { deleteCustomer } from '@/features/customers/actions/delete-customer';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: CustomerRow;
}

export function CellAction({ data }: CellActionProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    setLoading(true);
    const result = await deleteCustomer(data.id);
    setLoading(false);
    setOpen(false);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title='Müşteriyi sil'
        description='Bu müşteri silinecektir. Bu işlem geri alınamaz.'
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Menüyü aç</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/customers/${data.id}`)}
          >
            <IconEdit className='mr-2 h-4 w-4' /> Düzenle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
