'use client';

import { DeleteCellAction } from '@/components/ui/table/delete-cell-action';
import type { CustomerRow } from '@/features/customers/actions/get-customers';
import { deleteCustomer } from '@/features/customers/actions/delete-customer';

interface CellActionProps {
  data: CustomerRow;
}

export function CellAction({ data }: CellActionProps) {
  return (
    <DeleteCellAction
      data={data}
      editHref={`/dashboard/customers/${data.id}`}
      deleteAction={deleteCustomer}
      deleteTitle='Müşteriyi sil'
      deleteDescription='Bu müşteri silinecektir. Bu işlem geri alınamaz.'
      successMessage='Müşteri silindi.'
    />
  );
}
