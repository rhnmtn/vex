'use server';

import { db } from '@/db';
import { media, pages } from '@/db/drizzle-schema';
import { and, asc, eq, sql } from 'drizzle-orm';
import { getWebCompanyId } from '@/lib/web-company';

export type PublicPage = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  featuredImagePath: string | null;
};

/** Web company için aktif sayfaları döner (ana sayfa listesi için). */
export async function getPublicPages(): Promise<PublicPage[]> {
  const companyId = await getWebCompanyId();
  if (!companyId) return [];

  const rows = await db
    .select({
      id: pages.id,
      title: pages.title,
      slug: pages.slug,
      content: pages.content,
      metaTitle: pages.metaTitle,
      metaDescription: pages.metaDescription,
      featuredImagePath: media.path
    })
    .from(pages)
    .leftJoin(media, eq(pages.featuredImageId, media.id))
    .where(
      and(
        eq(pages.companyId, companyId),
        eq(pages.isActive, true),
        sql`${pages.deletedAt} IS NULL`
      )
    )
    .orderBy(asc(pages.title));

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    content: r.content ?? null,
    metaTitle: r.metaTitle ?? null,
    metaDescription: r.metaDescription ?? null,
    featuredImagePath: r.featuredImagePath ?? null
  }));
}

/** Slug ile aktif sayfayı döner. Auth gerekmez, web company kullanılır. */
export async function getPublicPageBySlug(
  slug: string
): Promise<PublicPage | null> {
  const companyId = await getWebCompanyId();
  if (!companyId || !slug?.trim()) return null;

  const [row] = await db
    .select({
      id: pages.id,
      title: pages.title,
      slug: pages.slug,
      content: pages.content,
      metaTitle: pages.metaTitle,
      metaDescription: pages.metaDescription,
      featuredImagePath: media.path
    })
    .from(pages)
    .leftJoin(media, eq(pages.featuredImageId, media.id))
    .where(
      and(
        eq(pages.companyId, companyId),
        eq(pages.slug, slug.trim()),
        eq(pages.isActive, true),
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
    featuredImagePath: row.featuredImagePath ?? null
  };
}
