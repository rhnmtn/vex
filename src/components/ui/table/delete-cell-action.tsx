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
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export interface DeleteCellActionProps<T extends { id: string | number }> {
  data: T;
  editHref: string;
  editLabel?: string;
  deleteAction: (id: T['id']) => Promise<{ success: boolean; error?: string }>;
  deleteTitle: string;
  deleteDescription: string;
  successMessage?: string;
}

export function DeleteCellAction<T extends { id: string | number }>({
  data,
  editHref,
  editLabel = 'Düzenle',
  deleteAction,
  deleteTitle,
  deleteDescription,
  successMessage = 'Silindi.'
}: DeleteCellActionProps<T>) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    setLoading(true);
    const result = await deleteAction(data.id);
    setLoading(false);
    setOpen(false);
    if (result.success) {
      toast.success(successMessage);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={deleteTitle}
        description={deleteDescription}
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
          <DropdownMenuItem asChild>
            <Link href={editHref}>
              <IconEdit className='mr-2 h-4 w-4' /> {editLabel}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
