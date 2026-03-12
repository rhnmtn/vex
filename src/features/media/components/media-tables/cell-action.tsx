'use client';

import { DeleteCellAction } from '@/components/ui/table/delete-cell-action';
import { deleteMedia } from '@/features/media/actions/delete-media';
import type { MediaRow } from '@/features/media/actions/get-media';

interface CellActionProps {
  data: MediaRow;
}

export function CellAction({ data }: CellActionProps) {
  return (
    <DeleteCellAction
      data={data}
      editHref={`/dashboard/media/${data.id}`}
      deleteAction={deleteMedia}
      deleteTitle='Medyayı sil'
      deleteDescription='Bu medya silinecektir. Bu işlem geri alınamaz.'
      successMessage='Medya silindi.'
    />
  );
}
