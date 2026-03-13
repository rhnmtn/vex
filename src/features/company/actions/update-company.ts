'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { companies } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type UpdateCompanyInput = {
  name?: string;
  shortName?: string;
  taxOffice?: string;
  taxNumber?: string;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  website?: string | null;
  description?: string | null;
  isActive?: boolean;
};

export async function updateCompany(
  input: UpdateCompanyInput
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
    .from(companies)
    .where(
      and(eq(companies.id, companyId), sql`${companies.deletedAt} IS NULL`)
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: 'Şirket bulunamadı' };
  }

  if (
    input.name !== undefined &&
    input.name !== null &&
    input.name.trim().length < 2
  ) {
    return {
      success: false,
      error: 'Şirket adı en az 2 karakter olmalıdır'
    };
  }

  if (
    input.shortName !== undefined &&
    input.shortName !== null &&
    input.shortName.trim().length < 2
  ) {
    return {
      success: false,
      error: 'Kısa ad en az 2 karakter olmalıdır'
    };
  }

  await db
    .update(companies)
    .set({
      ...(input.name != null && { name: input.name }),
      ...(input.shortName != null && { shortName: input.shortName }),
      ...(input.taxOffice != null && { taxOffice: input.taxOffice }),
      ...(input.taxNumber != null && { taxNumber: input.taxNumber }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.district !== undefined && { district: input.district }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.mobile !== undefined && { mobile: input.mobile }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.website !== undefined && { website: input.website }),
      ...(input.description !== undefined && {
        description: input.description
      }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      updatedByAuthId: session.user.id,
      updatedAt: new Date()
    })
    .where(eq(companies.id, companyId));

  revalidatePath('/dashboard/company');
  return { success: true };
}
