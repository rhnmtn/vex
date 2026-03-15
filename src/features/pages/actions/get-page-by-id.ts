'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { media, pages } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export type PageWithMedia = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
  featuredImageId: number | null;
  featuredImagePath: string | null;
};

export async function getPageById(
  pageId: number
): Promise<PageWithMedia | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Oturum gerekli');
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return null;
  }

  const [row] = await db
    .select({
      id: pages.id,
      title: pages.title,
      slug: pages.slug,
      content: pages.content,
      metaTitle: pages.metaTitle,
      metaDescription: pages.metaDescription,
      isActive: pages.isActive,
      featuredImageId: pages.featuredImageId,
      featuredImagePath: media.path
    })
    .from(pages)
    .leftJoin(media, eq(pages.featuredImageId, media.id))
    .where(
      and(
        eq(pages.id, pageId),
        eq(pages.companyId, companyId),
        sql`${pages.deletedAt} IS NULL`
      )
    )
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content ?? null,
    metaTitle: row.metaTitle ?? null,
    metaDescription: row.metaDescription ?? null,
    isActive: row.isActive ?? true,
    featuredImageId: row.featuredImageId ?? null,
    featuredImagePath: row.featuredImagePath ?? null
  };
}
