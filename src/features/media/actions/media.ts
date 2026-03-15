'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { getMediaById } from '@/features/media/actions/get-media';
import { db } from '@/db';
import {
  companies,
  media,
  pages,
  postCategories,
  posts,
  user,
  type Media
} from '@/db/drizzle-schema';
import { and, eq, ne, or, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { extractMediaIdsFromLexicalContent } from '@/features/editor/lib/lexical-content';
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
      err?.message || err?.error?.message || 'Görsel yüklenirken hata oluştu.';
    return { success: false, error: message };
  }
}

/**
 * Medya başka yerde (post content, page content, featured image, banner, logo, avatar vb.) kullanılıyor mu?
 * excludePostId: Bu post'un content'ini kontrol dışı bırak (güncelleme sırasında)
 * excludePostCategoryId: Bu kategori'nin content'ini kontrol dışı bırak (güncelleme sırasında)
 * excludePageId: Bu sayfanın content'ini kontrol dışı bırak (güncelleme sırasında)
 */
export async function isMediaUsedElsewhere(
  mediaId: number,
  companyId: number,
  excludePostId?: number,
  excludePostCategoryId?: number,
  excludePageId?: number
): Promise<boolean> {
  const [inFeaturedImage] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(
      and(eq(posts.companyId, companyId), eq(posts.featuredImageId, mediaId))
    )
    .limit(1);

  if (inFeaturedImage) return true;

  const [inBanner] = await db
    .select({ id: postCategories.id })
    .from(postCategories)
    .where(
      and(
        eq(postCategories.companyId, companyId),
        eq(postCategories.bannerImageId, mediaId)
      )
    )
    .limit(1);

  if (inBanner) return true;

  const [logoOrHero] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(
      or(
        eq(companies.logoLightMediaId, mediaId),
        eq(companies.logoDarkMediaId, mediaId),
        eq(companies.heroImageMediaId, mediaId)
      )
    )
    .limit(1);

  if (logoOrHero) return true;

  const [inAvatar] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.avatarMediaId, mediaId))
    .limit(1);

  if (inAvatar) return true;

  const postsWithContent = await db
    .select({ id: posts.id, content: posts.content })
    .from(posts)
    .where(
      and(
        eq(posts.companyId, companyId),
        sql`${posts.content} IS NOT NULL`,
        sql`${posts.deletedAt} IS NULL`,
        ...(excludePostId ? [ne(posts.id, excludePostId)] : [])
      )
    );

  for (const row of postsWithContent) {
    if (extractMediaIdsFromLexicalContent(row.content).includes(mediaId)) {
      return true;
    }
  }

  const categoriesWithContent = await db
    .select({ id: postCategories.id, content: postCategories.content })
    .from(postCategories)
    .where(
      and(
        eq(postCategories.companyId, companyId),
        sql`${postCategories.content} IS NOT NULL`,
        sql`${postCategories.deletedAt} IS NULL`,
        ...(excludePostCategoryId
          ? [ne(postCategories.id, excludePostCategoryId)]
          : [])
      )
    );

  for (const row of categoriesWithContent) {
    if (extractMediaIdsFromLexicalContent(row.content).includes(mediaId)) {
      return true;
    }
  }

  const pagesWithContent = await db
    .select({ id: pages.id, content: pages.content })
    .from(pages)
    .where(
      and(
        eq(pages.companyId, companyId),
        sql`${pages.content} IS NOT NULL`,
        sql`${pages.deletedAt} IS NULL`,
        ...(excludePageId ? [ne(pages.id, excludePageId)] : [])
      )
    );

  for (const row of pagesWithContent) {
    if (extractMediaIdsFromLexicalContent(row.content).includes(mediaId)) {
      return true;
    }
  }

  const [inPageFeatured] = await db
    .select({ id: pages.id })
    .from(pages)
    .where(
      and(eq(pages.companyId, companyId), eq(pages.featuredImageId, mediaId))
    )
    .limit(1);

  if (inPageFeatured) return true;

  return false;
}

/**
 * Post content güncellendiğinde artık referans edilmeyen medyaları siler.
 * Eski ve yeni content'ten mediaId'leri çıkarır, orphan olanları deleteMedia ile siler.
 */
export async function deleteOrphanedMediaFromPostContent(
  companyId: number,
  postId: number,
  oldContent: string | null | undefined,
  newContent: string | null | undefined
): Promise<{ success: true } | { success: false; error: string }> {
  const oldIds = extractMediaIdsFromLexicalContent(oldContent);
  const newIds = new Set(extractMediaIdsFromLexicalContent(newContent));
  const orphanedIds = oldIds.filter((id) => !newIds.has(id));

  for (const mediaId of orphanedIds) {
    const used = await isMediaUsedElsewhere(
      mediaId,
      companyId,
      postId,
      undefined,
      undefined
    );
    if (!used) {
      const result = await deleteMedia(mediaId);
      if (!result.success) {
        return result;
      }
    }
  }

  return { success: true };
}

/**
 * Post category content güncellendiğinde artık referans edilmeyen medyaları siler.
 */
export async function deleteOrphanedMediaFromPostCategoryContent(
  companyId: number,
  postCategoryId: number,
  oldContent: string | null | undefined,
  newContent: string | null | undefined
): Promise<{ success: true } | { success: false; error: string }> {
  const oldIds = extractMediaIdsFromLexicalContent(oldContent);
  const newIds = new Set(extractMediaIdsFromLexicalContent(newContent));
  const orphanedIds = oldIds.filter((id) => !newIds.has(id));

  for (const mediaId of orphanedIds) {
    const used = await isMediaUsedElsewhere(
      mediaId,
      companyId,
      undefined,
      postCategoryId,
      undefined
    );
    if (!used) {
      const result = await deleteMedia(mediaId);
      if (!result.success) {
        return result;
      }
    }
  }

  return { success: true };
}

export async function deleteOrphanedMediaFromPageContent(
  companyId: number,
  pageId: number,
  oldContent: string | null | undefined,
  newContent: string | null | undefined
): Promise<{ success: true } | { success: false; error: string }> {
  const oldIds = extractMediaIdsFromLexicalContent(oldContent);
  const newIds = new Set(extractMediaIdsFromLexicalContent(newContent));
  const orphanedIds = oldIds.filter((id) => !newIds.has(id));

  for (const mediaId of orphanedIds) {
    const used = await isMediaUsedElsewhere(
      mediaId,
      companyId,
      undefined,
      undefined,
      pageId
    );
    if (!used) {
      const result = await deleteMedia(mediaId);
      if (!result.success) {
        return result;
      }
    }
  }

  return { success: true };
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
        console.warn(
          '[deleteMedia] Cloudinary silme hatası:',
          mediaRow.publicId,
          cloudErr
        );
      }
    }

    // 2. Entity referanslarını temizle (FK ihlali önleme)
    await db
      .update(companies)
      .set({ logoLightMediaId: null })
      .where(eq(companies.logoLightMediaId, id));
    await db
      .update(companies)
      .set({ logoDarkMediaId: null })
      .where(eq(companies.logoDarkMediaId, id));
    await db
      .update(companies)
      .set({ heroImageMediaId: null })
      .where(eq(companies.heroImageMediaId, id));
    await db
      .update(postCategories)
      .set({ bannerImageId: null })
      .where(eq(postCategories.bannerImageId, id));
    await db
      .update(posts)
      .set({ featuredImageId: null })
      .where(eq(posts.featuredImageId, id));
    await db
      .update(pages)
      .set({ featuredImageId: null })
      .where(eq(pages.featuredImageId, id));
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
      err?.message || err?.error?.message || 'Medya silinirken hata oluştu.';
    return { success: false, error: message };
  }
}
