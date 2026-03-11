'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import {
  media,
  postCategories,
  posts,
  user,
  type Media
} from '@/db/drizzle-schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  isCloudinaryConfigured
} from '@/lib/cloudinary';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

export async function uploadMedia(
  formData: FormData
): Promise<
  { success: true; media: Media } | { success: false; error: string }
> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) {
    return {
      success: false,
      error: 'Oturum bulunamadı veya şirket atanmamış.'
    };
  }

  if (!isCloudinaryConfigured) {
    return {
      success: false,
      error:
        'Cloudinary yapılandırılmamış. CLOUDINARY_* ortam değişkenlerini ayarlayın.'
    };
  }

  const file = formData.get('file') as File | null;
  if (!file || !(file instanceof File)) {
    return { success: false, error: 'Dosya bulunamadı.' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: 'Sadece JPEG, PNG, WebP veya GIF formatları desteklenir.'
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      success: false,
      error: 'Dosya boyutu en fazla 10MB olabilir.'
    };
  }

  const alt = (formData.get('alt') as string)?.trim() || null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, {
      filename: file.name,
      mimeType: file.type,
      folder: `media/company_${u.companyId}`,
      alt: alt ?? undefined
    });

    const [inserted] = await db
      .insert(media)
      .values({
        companyId: u.companyId,
        createdByAuthId: u.id,
        publicId: result.publicId,
        path: result.path,
        filename: file.name,
        mimeType: file.type,
        size: result.bytes,
        alt,
        width: result.width,
        height: result.height
      })
      .returning();

    if (!inserted) {
      return { success: false, error: 'Medya kaydı oluşturulamadı.' };
    }

    return { success: true, media: inserted };
  } catch (e) {
    const err = e as Error & { error?: { message?: string } };
    const message =
      err?.message ||
      err?.error?.message ||
      'Görsel yüklenirken hata oluştu.';
    return { success: false, error: message };
  }
}

export async function getMediaById(id: number): Promise<Media | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) return null;

  const [row] = await db
    .select()
    .from(media)
    .where(eq(media.id, id))
    .limit(1);

  if (!row || row.companyId !== u.companyId) return null;
  return row;
}

/**
 * Önce Cloudinary'den siler, sonra DB'den siler.
 * Entity referansları (bannerImageId, featuredImageId vb.) güncelleme çağıran tarafın sorumluluğundadır.
 */
export async function deleteMedia(
  id: number
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) {
    return { success: false, error: 'Oturum bulunamadı.' };
  }

  const mediaRow = await getMediaById(id);
  if (!mediaRow) {
    return { success: false, error: 'Medya bulunamadı.' };
  }

  try {
    // 1. Önce Cloudinary'den sil
    if (mediaRow.publicId && isCloudinaryConfigured) {
      try {
        await deleteFromCloudinary(mediaRow.publicId);
      } catch (cloudErr) {
        console.warn('[deleteMedia] Cloudinary silme hatası:', mediaRow.publicId, cloudErr);
      }
    }

    // 2. Entity referanslarını temizle (FK ihlali önleme)
    await db
      .update(postCategories)
      .set({ bannerImageId: null })
      .where(eq(postCategories.bannerImageId, id));
    await db
      .update(posts)
      .set({ featuredImageId: null })
      .where(eq(posts.featuredImageId, id));
    await db
      .update(user)
      .set({ avatarMediaId: null })
      .where(eq(user.avatarMediaId, id));

    // 3. DB'den sil
    await db.delete(media).where(eq(media.id, id));

    return { success: true };
  } catch (e) {
    const err = e as Error & { error?: { message?: string } };
    const message =
      err?.message ||
      err?.error?.message ||
      'Medya silinirken hata oluştu.';
    return { success: false, error: message };
  }
}
