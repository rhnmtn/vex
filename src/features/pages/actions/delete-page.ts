'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { pages } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function deletePage(
  pageId: number
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
    .from(pages)
    .where(
      and(
        eq(pages.id, pageId),
        eq(pages.companyId, companyId),
        sql`${pages.deletedAt} IS NULL`
      )
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: 'Sayfa bulunamadı' };
  }

  await db
    .update(pages)
    .set({
      deletedAt: new Date(),
      updatedByAuthId: session.user.id,
      updatedAt: new Date()
    })
    .where(eq(pages.id, pageId));

  revalidatePath('/dashboard/pages');
  return { success: true };
}
