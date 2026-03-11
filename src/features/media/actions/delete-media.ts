'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { media } from '@/db/drizzle-schema';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export type DeleteMediaResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteMedia(id: number): Promise<DeleteMediaResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) {
    return { success: false, error: 'Oturum bulunamadı.' };
  }

  try {
    const [row] = await db
      .select({ publicId: media.publicId })
      .from(media)
      .where(
        and(eq(media.id, id), eq(media.companyId, u.companyId))
      )
      .limit(1);

    if (!row) {
      return { success: false, error: 'Medya bulunamadı.' };
    }

    await db
      .delete(media)
      .where(
        and(eq(media.id, id), eq(media.companyId, u.companyId))
      );

    if (row.publicId) {
      await deleteFromCloudinary(row.publicId);
    }

    revalidatePath('/dashboard/media');
    return { success: true };
  } catch {
    return { success: false, error: 'Medya silinirken hata oluştu.' };
  }
}
