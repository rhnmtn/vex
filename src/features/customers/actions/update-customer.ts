'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { customers } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type UpdateCustomerInput = {
  name?: string;
  contactName?: string | null;
  mobile?: string | null;
  email?: string | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  taxOffice?: string | null;
  taxNumber?: string | null;
  description?: string | null;
  isActive?: boolean;
};

export async function updateCustomer(
  customerId: number,
  input: UpdateCustomerInput
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Oturum gerekli' };
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return { success: false, error: 'Şirket atanmamış' };
  }

  const [existing] = await db
    .select()
    .from(customers)
    .where(
      and(
        eq(customers.id, customerId),
        eq(customers.companyId, companyId),
        sql`${customers.deletedAt} IS NULL`
      )
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: 'Müşteri bulunamadı' };
  }

  if (
    input.name !== undefined &&
    input.name !== null &&
    input.name.trim().length < 2
  ) {
    return {
      success: false,
      error: 'Firma adı en az 2 karakter olmalıdır'
    };
  }

  await db
    .update(customers)
    .set({
      ...(input.name != null && { name: input.name }),
      ...(input.contactName !== undefined && { contactName: input.contactName }),
      ...(input.mobile !== undefined && { mobile: input.mobile }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.district !== undefined && { district: input.district }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.taxOffice !== undefined && { taxOffice: input.taxOffice }),
      ...(input.taxNumber !== undefined && { taxNumber: input.taxNumber }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      updatedByAuthId: session.user.id,
      updatedAt: new Date()
    })
    .where(eq(customers.id, customerId));

  revalidatePath('/dashboard/customers');
  revalidatePath(`/dashboard/customers/${customerId}`);
  return { success: true };
}
