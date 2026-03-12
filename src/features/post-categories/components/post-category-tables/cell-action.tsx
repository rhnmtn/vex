'use client';

import { DeleteCellAction } from '@/components/ui/table/delete-cell-action';
import type { PostCategoryRow } from '@/features/post-categories/actions/get-post-categories';
import { deletePostCategory } from '@/features/post-categories/actions/delete-post-category';

interface CellActionProps {
  data: PostCategoryRow;
}

export function CellAction({ data }: CellActionProps) {
  return (
    <DeleteCellAction
      data={data}
      editHref={`/dashboard/post-categories/${data.id}`}
      deleteAction={deletePostCategory}
      deleteTitle='Kategoriyi sil'
      deleteDescription='Bu kategori silinecektir. Bu işlem geri alınamaz.'
      successMessage='Kategori silindi.'
    />
  );
}
