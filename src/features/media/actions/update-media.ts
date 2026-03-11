'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { media } from '@/db/drizzle-schema';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type UpdateMediaResult =
  | { success: true }
  | { success: false; error: string };

export async function updateMedia(
  id: number,
  data: { alt?: string | null }
): Promise<UpdateMediaResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) {
    return { success: false, error: 'Oturum bulunamadı.' };
  }

  try {
    await db
      .update(media)
      .set({
        alt: data.alt ?? null,
        updatedAt: new Date()
      })
      .where(
        and(eq(media.id, id), eq(media.companyId, u.companyId))
      );

    revalidatePath('/dashboard/media');
    revalidatePath(`/dashboard/media/${id}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Medya güncellenirken hata oluştu.' };
  }
}
