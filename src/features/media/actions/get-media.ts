'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { media } from '@/db/drizzle-schema';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export type MediaRow = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  createdByAuthId: string | null;
  companyId: number;
  publicId: string | null;
  path: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: string | null;
  width: number | null;
  height: number | null;
};

export async function getMedia(filters: {
  page?: number;
  limit?: number;
  filename?: string;
  mimeType?: string;
}): Promise<{ items: MediaRow[]; total: number }> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) {
    return { items: [], total: 0 };
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  const conditions = [eq(media.companyId, u.companyId)];
  if (filters.filename) {
    conditions.push(ilike(media.filename, `%${filters.filename}%`));
  }
  if (filters.mimeType) {
    conditions.push(eq(media.mimeType, filters.mimeType));
  }

  const whereClause = and(...conditions);

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(media)
      .where(whereClause)
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(media)
      .where(whereClause)
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    items: items as MediaRow[],
    total
  };
}

export async function getMediaById(id: number): Promise<MediaRow | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) return null;

  const [row] = await db
    .select()
    .from(media)
    .where(
      and(eq(media.id, id), eq(media.companyId, u.companyId))
    )
    .limit(1);

  return (row as MediaRow) ?? null;
}
