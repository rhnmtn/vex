'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { customers } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Müşteriyi soft delete yapar (deletedAt set eder).
 */
export async function deleteCustomer(
  customerId: number
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

  await db
    .update(customers)
    .set({
      deletedAt: new Date(),
      updatedByAuthId: session.user.id,
      updatedAt: new Date()
    })
    .where(eq(customers.id, customerId));

  revalidatePath('/dashboard/customers');
  return { success: true };
}
