'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { user } from '@/db/drizzle-schema';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { uploadMedia, deleteMedia } from '@/features/media/actions/media';
import { userUpdateSchema } from '@/features/users/schemas/user-schema';

export type UpdateUserWithAvatarResult =
  | { success: true }
  | { success: false; error: string };

export async function updateUserWithAvatar(
  userId: string,
  formData: FormData
): Promise<UpdateUserWithAvatarResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) {
    return { success: false, error: 'Oturum bulunamadı.' };
  }

  const [existingUser] = await db
    .select({ avatarMediaId: user.avatarMediaId })
    .from(user)
    .where(
      and(eq(user.id, userId), eq(user.companyId, u.companyId))
    )
    .limit(1);

  if (!existingUser) {
    return { success: false, error: 'Kullanıcı bulunamadı.' };
  }

  const avatarFile = formData.get('avatarFile') as File | null;
  const avatarRemoved = formData.get('avatarRemoved') === 'true';
  const existingAvatarId = existingUser.avatarMediaId;

  let newAvatarMediaId: number | null = existingAvatarId;

  // Görsel kaldırıldı
  if (avatarRemoved && existingAvatarId) {
    const deleteResult = await deleteMedia(existingAvatarId);
    if (!deleteResult.success) {
      return { success: false, error: deleteResult.error };
    }
    newAvatarMediaId = null;
  }
  // Yeni görsel yüklendi
  else if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
    // Önce eski varsa sil
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

  // Diğer alanlar (name, title, phone, role, isActive) - server-side validasyon
  const nameRaw = (formData.get('name') as string)?.trim() ?? '';
  const titleRaw = (formData.get('title') as string)?.trim() || null;
  const phoneRaw = (formData.get('phone') as string)?.trim() || null;
  const roleRaw = formData.get('role') as string | null;
  const isActiveRaw = formData.get('isActive');
  const isActiveRawVal =
    isActiveRaw === undefined ? undefined : isActiveRaw !== 'false';

  const parsed = userUpdateSchema
    .pick({ name: true, title: true, phone: true, role: true, isActive: true })
    .safeParse({
      name: nameRaw,
      title: titleRaw,
      phone: phoneRaw,
      role: roleRaw && roleRaw.trim() ? roleRaw.trim() : null,
      isActive: isActiveRawVal ?? true
    });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? 'Geçersiz veri'
    };
  }

  const { name, title, phone, role, isActive } = parsed.data;

  const updateData: Record<string, unknown> = {
    name,
    avatarMediaId: newAvatarMediaId,
    updatedAt: new Date(),
    title: title ?? null,
    phone: phone ?? null,
    role: role ?? null,
    isActive: isActive ?? true
  };

  await db
    .update(user)
    .set(updateData as Record<string, unknown>)
    .where(
      and(eq(user.id, userId), eq(user.companyId, u.companyId))
    );

  return { success: true };
}
