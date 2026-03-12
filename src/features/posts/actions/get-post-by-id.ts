'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import {
  media,
  postCategoryAssignments,
  posts
} from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function getPostById(postId: number) {
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
    .from(posts)
    .where(
      and(
        eq(posts.id, postId),
        eq(posts.companyId, companyId),
        sql`${posts.deletedAt} IS NULL`
      )
    )
    .limit(1);

  if (!row) return null;

  const [categoryRows, featuredMedia] = await Promise.all([
    db
      .select({ categoryId: postCategoryAssignments.categoryId })
      .from(postCategoryAssignments)
      .where(eq(postCategoryAssignments.postId, postId)),
    row.featuredImageId
      ? db
          .select({ path: media.path })
          .from(media)
          .where(eq(media.id, row.featuredImageId))
          .limit(1)
      : Promise.resolve([])
  ]);

  return {
    ...row,
    categoryIds: categoryRows.map((r) => r.categoryId),
    featuredImagePath: featuredMedia[0]?.path ?? null
  };
}
