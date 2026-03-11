'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { user, media } from '@/db/drizzle-schema';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  avatarMediaId: number | null;
  role: string | null;
  title: string | null;
  phone: string | null;
  isActive: boolean;
  companyId: number | null;
  createdAt: Date;
  updatedAt: Date;
  avatarPath: string | null;
};

export async function getUsers(filters: {
  page?: number;
  limit?: number;
  name?: string;
  role?: string;
  isActive?: boolean;
}): Promise<{ users: UserRow[]; total: number }> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) {
    return { users: [], total: 0 };
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  const conditions = [eq(user.companyId, u.companyId)];
  if (filters.name?.trim()) {
    const pattern = `%${filters.name.trim()}%`;
    conditions.push(ilike(user.name, pattern));
  }
  if (filters.role) {
    conditions.push(eq(user.role, filters.role as 'ADMIN' | 'MANAGER' | 'USER' | 'GUEST'));
  }
  if (filters.isActive !== undefined) {
    conditions.push(eq(user.isActive, filters.isActive));
  }

  const whereClause = and(...conditions);

  const [rows, countResult] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        avatarMediaId: user.avatarMediaId,
        role: user.role,
        title: user.title,
        phone: user.phone,
        isActive: user.isActive,
        companyId: user.companyId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        avatarPath: media.path
      })
      .from(user)
      .leftJoin(media, eq(user.avatarMediaId, media.id))
      .where(whereClause)
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(user)
      .where(whereClause)
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    users: rows.map((r) => ({
      ...r,
      avatarPath: r.avatarPath ?? null
    })) as UserRow[],
    total
  };
}
