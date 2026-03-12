'use client';

import { DeleteCellAction } from '@/components/ui/table/delete-cell-action';
import type { PostRow } from '@/features/posts/actions/get-posts';
import { deletePost } from '@/features/posts/actions/delete-post';

interface CellActionProps {
  data: PostRow;
}

export function CellAction({ data }: CellActionProps) {
  return (
    <DeleteCellAction
      data={data}
      editHref={`/dashboard/posts/${data.id}`}
      deleteAction={deletePost}
      deleteTitle='Yazıyı sil'
      deleteDescription='Bu yazı silinecektir. Bu işlem geri alınamaz.'
      successMessage='Yazı silindi.'
    />
  );
}
