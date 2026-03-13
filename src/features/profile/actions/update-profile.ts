'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { user } from '@/db/drizzle-schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { uploadMedia, deleteMedia } from '@/features/media/actions/media';
import { profileFormSchema } from '@/features/profile/schemas/profile-schema';

export type UpdateProfileResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Oturumdaki kullanıcının kendi profil bilgilerini günceller.
 * Sadece name, title, phone ve avatar güncellenir.
 */
export async function updateProfile(
  formData: FormData
): Promise<UpdateProfileResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.id) {
    return { success: false, error: 'Oturum bulunamadı.' };
  }

  const userId = u.id;

  const [existingUser] = await db
    .select({ avatarMediaId: user.avatarMediaId })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!existingUser) {
    return { success: false, error: 'Kullanıcı bulunamadı.' };
  }

  const avatarFile = formData.get('avatarFile') as File | null;
  const avatarRemoved = formData.get('avatarRemoved') === 'true';
  const existingAvatarId = existingUser.avatarMediaId;

  let newAvatarMediaId: number | null = existingAvatarId;

  if (avatarRemoved && existingAvatarId && u.companyId) {
    const deleteResult = await deleteMedia(existingAvatarId);
    if (!deleteResult.success) {
      return { success: false, error: deleteResult.error };
    }
    newAvatarMediaId = null;
  } else if (
    avatarFile &&
    avatarFile instanceof File &&
    avatarFile.size > 0 &&
    u.companyId
  ) {
    if (existingAvatarId) {
      const deleteResult = await deleteMedia(existingAvatarId);
      if (!deleteResult.success) {
        return { success: false, error: deleteResult.error };
      }
    }

    const uploadFormData = new FormData();
    uploadFormData.set('file', avatarFile);
    const uploadResult = await uploadMedia(uploadFormData);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    newAvatarMediaId = uploadResult.media.id;
  }

  const nameRaw = (formData.get('name') as string)?.trim() ?? '';
  const titleRaw = (formData.get('title') as string)?.trim() || null;
  const phoneRaw = (formData.get('phone') as string)?.trim() || null;

  const parsed = profileFormSchema.safeParse({
    name: nameRaw,
    title: titleRaw,
    phone: phoneRaw,
    avatarMediaId: newAvatarMediaId,
    avatarFile: null
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? 'Geçersiz veri'
    };
  }

  const { name, title, phone } = parsed.data;

  await db
    .update(user)
    .set({
      name,
      title: title ?? null,
      phone: phone ?? null,
      avatarMediaId: newAvatarMediaId,
      updatedAt: new Date()
    })
    .where(eq(user.id, userId));

  revalidatePath('/dashboard/profile');
  return { success: true };
}
