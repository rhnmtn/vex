'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { pages } from '@/db/drizzle-schema';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export type GetPagesFilters = {
  page?: number;
  limit?: number;
  title?: string;
};

export type PageRow = {
  id: number;
  title: string;
  slug: string;
  isActive: boolean;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GetPagesResult = {
  pages: PageRow[];
  total: number;
};

export async function getPages(
  filters: GetPagesFilters = {}
): Promise<GetPagesResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Oturum gerekli');
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return { pages: [], total: 0 };
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  const conditions = [
    eq(pages.companyId, companyId),
    sql`${pages.deletedAt} IS NULL`
  ];

  if (filters.title?.trim()) {
    conditions.push(
      or(
        ilike(pages.title, `%${filters.title.trim()}%`),
        ilike(pages.slug, `%${filters.title.trim()}%`)
      )!
    );
  }

  const whereClause = and(...conditions);

  const [rows, countResult] = await Promise.all([
    db
      .select({
        id: pages.id,
        title: pages.title,
        slug: pages.slug,
        isActive: pages.isActive,
        companyId: pages.companyId,
        createdAt: pages.createdAt,
        updatedAt: pages.updatedAt
      })
      .from(pages)
      .where(whereClause)
      .orderBy(desc(pages.updatedAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(pages)
      .where(whereClause)
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    pages: rows.map((r) => ({
      ...r,
      isActive: r.isActive ?? true,
      createdAt: r.createdAt ?? new Date(),
      updatedAt: r.updatedAt ?? new Date()
    })),
    total
  };
}
