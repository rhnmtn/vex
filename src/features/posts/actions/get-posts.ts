'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { media, posts } from '@/db/drizzle-schema';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export type GetPostsFilters = {
  page?: number;
  limit?: number;
  title?: string;
};

export type PostRow = {
  id: number;
  title: string;
  slug: string;
  isActive: boolean;
  publishedAt: Date | null;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
  featuredImagePath: string | null;
};

export type GetPostsResult = {
  posts: PostRow[];
  total: number;
};

export async function getPosts(
  filters: GetPostsFilters = {}
): Promise<GetPostsResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Oturum gerekli');
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return { posts: [], total: 0 };
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  const conditions = [
    eq(posts.companyId, companyId),
    sql`${posts.deletedAt} IS NULL`
  ];

  if (filters.title?.trim()) {
    conditions.push(
      or(
        ilike(posts.title, `%${filters.title.trim()}%`),
        ilike(posts.slug, `%${filters.title.trim()}%`)
      )!
    );
  }

  const whereClause = and(...conditions);

  const [rows, countResult] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        isActive: posts.isActive,
        publishedAt: posts.publishedAt,
        companyId: posts.companyId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        featuredImagePath: media.path
      })
      .from(posts)
      .leftJoin(media, eq(posts.featuredImageId, media.id))
      .where(whereClause)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(whereClause)
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    posts: rows.map((r) => ({
      ...r,
      isActive: r.isActive ?? true,
      publishedAt: r.publishedAt ?? null,
      featuredImagePath: r.featuredImagePath ?? null,
      createdAt: r.createdAt ?? new Date(),
      updatedAt: r.updatedAt ?? new Date()
    })),
    total
  };
}
