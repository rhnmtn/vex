'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { customers } from '@/db/drizzle-schema';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type CreateCustomerInput = {
  name: string;
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

export async function createCustomer(
  input: CreateCustomerInput
): Promise<{ success: boolean; id?: number; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Oturum gerekli' };
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return { success: false, error: 'Şirket atanmamış' };
  }

  if (!input.name?.trim() || input.name.trim().length < 2) {
    return {
      success: false,
      error: 'Firma adı en az 2 karakter olmalıdır'
    };
  }

  const authId = session.user.id;

  const [inserted] = await db
    .insert(customers)
    .values({
      companyId,
      createdByAuthId: authId,
      updatedByAuthId: authId,
      name: input.name,
      contactName: input.contactName || null,
      mobile: input.mobile || null,
      email: (input.email && input.email.trim()) ? input.email.trim() : null,
      city: input.city || null,
      district: input.district || null,
      address: input.address || null,
      taxOffice: input.taxOffice || null,
      taxNumber: input.taxNumber || null,
      description: input.description || null,
      isActive: input.isActive ?? true
    })
    .returning({ id: customers.id });

  revalidatePath('/dashboard/customers');
  if (!inserted?.id) {
    return { success: false, error: 'Kayıt oluşturulamadı' };
  }
  return { success: true, id: inserted.id };
}
