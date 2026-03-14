'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { user, media } from '@/db/drizzle-schema';
import { eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export type CurrentUserWithAvatar = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  avatarMediaId: number | null;
  title: string | null;
  phone: string | null;
  avatarPath: string | null;
};

/** Oturumdaki kullanıcının profil bilgilerini döner. */
export async function getCurrentUser(): Promise<CurrentUserWithAvatar | null> {
  const u = getSessionUser(await auth.api.getSession({ headers: await headers() }));
  if (!u?.id) return null;

  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      avatarMediaId: user.avatarMediaId,
      title: user.title,
      phone: user.phone,
      avatarPath: sql<string | null>`coalesce(${media.path}, null)`.as('avatarPath')
    })
    .from(user)
    .leftJoin(media, eq(user.avatarMediaId, media.id))
    .where(eq(user.id, u.id))
    .limit(1);

  return row ?? null;
}
