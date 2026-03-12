'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { media, postCategories } from '@/db/drizzle-schema';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export type GetPostCategoriesFilters = {
  page?: number;
  limit?: number;
  name?: string;
};

export type PostCategoryRow = {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
  bannerImagePath: string | null;
};

export type GetPostCategoriesResult = {
  postCategories: PostCategoryRow[];
  total: number;
};

export async function getPostCategories(
  filters: GetPostCategoriesFilters = {}
): Promise<GetPostCategoriesResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Oturum gerekli');
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return { postCategories: [], total: 0 };
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  const conditions = [
    eq(postCategories.companyId, companyId),
    sql`${postCategories.deletedAt} IS NULL`
  ];

  if (filters.name?.trim()) {
    conditions.push(
      or(
        ilike(postCategories.name, `%${filters.name.trim()}%`),
        ilike(postCategories.slug, `%${filters.name.trim()}%`)
      )!
    );
  }

  const whereClause = and(...conditions);

  const [rows, countResult] = await Promise.all([
    db
      .select({
        id: postCategories.id,
        name: postCategories.name,
        slug: postCategories.slug,
        isActive: postCategories.isActive,
        companyId: postCategories.companyId,
        createdAt: postCategories.createdAt,
        updatedAt: postCategories.updatedAt,
        bannerImagePath: media.path
      })
      .from(postCategories)
      .leftJoin(media, eq(postCategories.bannerImageId, media.id))
      .where(whereClause)
      .orderBy(desc(postCategories.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(postCategories)
      .where(whereClause)
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    postCategories: rows.map((r) => ({
      ...r,
      isActive: r.isActive ?? true,
      bannerImagePath: r.bannerImagePath ?? null,
      createdAt: r.createdAt ?? new Date(),
      updatedAt: r.updatedAt ?? new Date()
    })),
    total
  };
}
