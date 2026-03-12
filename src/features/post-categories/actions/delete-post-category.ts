'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { postCategories } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function deletePostCategory(
  postCategoryId: number
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
    .from(postCategories)
    .where(
      and(
        eq(postCategories.id, postCategoryId),
        eq(postCategories.companyId, companyId),
        sql`${postCategories.deletedAt} IS NULL`
      )
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: 'Kategori bulunamadı' };
  }

  await db
    .update(postCategories)
    .set({
      deletedAt: new Date(),
      updatedByAuthId: session.user.id,
      updatedAt: new Date()
    })
    .where(eq(postCategories.id, postCategoryId));

  revalidatePath('/dashboard/post-categories');
  return { success: true };
}
