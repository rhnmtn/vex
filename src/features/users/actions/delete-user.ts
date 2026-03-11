'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { user } from '@/db/drizzle-schema';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Kullanıcıyı pasif yapar (isActive=false).
 * Better Auth session/account cascade ile silme yapılmaz.
 */
export async function deleteUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u) {
    return { success: false, error: 'Oturum gerekli' };
  }

  if (u.id === userId) {
    return { success: false, error: 'Kendi hesabınızı devre dışı bırakamazsınız' };
  }

  const companyId = u.companyId;
  const conditions = [eq(user.id, userId)];
  if (companyId != null) {
    conditions.push(eq(user.companyId, companyId));
  }

  const [existing] = await db
    .select()
    .from(user)
    .where(and(...conditions))
    .limit(1);

  if (!existing) {
    return { success: false, error: 'Kullanıcı bulunamadı' };
  }

  await db
    .update(user)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(user.id, userId));

  revalidatePath('/dashboard/users');
  return { success: true };
}
