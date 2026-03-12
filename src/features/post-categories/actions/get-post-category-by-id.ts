'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { postCategories } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function getPostCategoryById(postCategoryId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Oturum gerekli');
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return null;
  }

  const [row] = await db
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

  return row ?? null;
}
