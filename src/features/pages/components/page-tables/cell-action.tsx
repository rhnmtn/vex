'use client';

import { DeleteCellAction } from '@/components/ui/table/delete-cell-action';
import type { PageRow } from '@/features/pages/actions/get-pages';
import { deletePage } from '@/features/pages/actions/delete-page';

interface CellActionProps {
  data: PageRow;
}

export function CellAction({ data }: CellActionProps) {
  return (
    <DeleteCellAction
      data={data}
      editHref={`/dashboard/pages/${data.id}`}
      deleteAction={deletePage}
      deleteTitle='Sayfayı sil'
      deleteDescription='Bu sayfa silinecektir. Bu işlem geri alınamaz.'
      successMessage='Sayfa silindi.'
    />
  );
}
