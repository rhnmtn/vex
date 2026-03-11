'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { user, media } from '@/db/drizzle-schema';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export type UserWithAvatar = {
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
  avatarPath?: string | null;
};

export async function getUserById(
  userId: string
): Promise<UserWithAvatar | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) return null;

  const [row] = await db
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
      avatarPath: media.path
    })
    .from(user)
    .leftJoin(media, eq(user.avatarMediaId, media.id))
    .where(
      and(eq(user.id, userId), eq(user.companyId, u.companyId))
    )
    .limit(1);

  if (!row) return null;

  return {
    ...row,
    avatarPath: row.avatarPath ?? null
  } as UserWithAvatar;
}
