'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { postCategories } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

/** Form select/checkbox için tüm aktif kategorileri döner (sayfalama yok) */
export async function getPostCategoriesList(): Promise<
  { id: number; name: string }[]
> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return [];
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return [];
  }

  const rows = await db
    .select({ id: postCategories.id, name: postCategories.name })
    .from(postCategories)
    .where(
      and(
        eq(postCategories.companyId, companyId),
        sql`${postCategories.deletedAt} IS NULL`,
        eq(postCategories.isActive, true)
      )
    )
    .orderBy(postCategories.name);

  return rows;
}
