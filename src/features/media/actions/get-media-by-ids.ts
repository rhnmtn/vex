'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { media } from '@/db/drizzle-schema';
import { and, eq, inArray } from 'drizzle-orm';
import { headers } from 'next/headers';

export type MediaItem = {
  id: number;
  path: string;
  filename: string;
  alt: string | null;
};

export async function getMediaByIds(
  ids: number[]
): Promise<MediaItem[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId || ids.length === 0) {
    return [];
  }

  const rows = await db
    .select({
      id: media.id,
      path: media.path,
      filename: media.filename,
      alt: media.alt
    })
    .from(media)
    .where(
      and(
        inArray(media.id, ids),
        eq(media.companyId, u.companyId)
      )
    );

  return rows as MediaItem[];
}
