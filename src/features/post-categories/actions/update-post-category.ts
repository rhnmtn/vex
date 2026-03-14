'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { postCategories } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  deleteMedia,
  deleteOrphanedMediaFromPostCategoryContent,
  uploadMedia
} from '@/features/media/actions/media';

export type UpdatePostCategoryInput = {
  name?: string;
  slug?: string;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive?: boolean;
  bannerImageId?: number | null;
  bannerImageFile?: File | null;
  bannerRemoved?: boolean;
};

export async function updatePostCategory(
  postCategoryId: number,
  input: UpdatePostCategoryInput
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Oturum gerekli' };
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return { success: false, error: 'Şirket atanmamış' };
  }

  const [existing] = await db
    .select()
    .from(postCategories)
    .where(
      and(
        eq(postCategories.id, postCategoryId),
        eq(postCategories.companyId, companyId),
        sql`${postCategories.deletedAt} IS NULL`
      )
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: 'Kategori bulunamadı' };
  }

  if (
    input.name !== undefined &&
    input.name !== null &&
    input.name.trim().length < 2
  ) {
    return {
      success: false,
      error: 'Kategori adı en az 2 karakter olmalıdır'
    };
  }

  if (
    input.slug !== undefined &&
    input.slug !== null &&
    input.slug.trim().length < 2
  ) {
    return {
      success: false,
      error: 'Slug en az 2 karakter olmalıdır'
    };
  }

  if (input.content !== undefined) {
    const orphanResult = await deleteOrphanedMediaFromPostCategoryContent(
      companyId,
      postCategoryId,
      existing.content,
      input.content
    );
    if (!orphanResult.success) {
      return { success: false, error: orphanResult.error };
    }
  }

  let newBannerImageId: number | null = existing.bannerImageId ?? null;

  if (input.bannerRemoved && existing.bannerImageId) {
    const deleteResult = await deleteMedia(existing.bannerImageId);
    if (!deleteResult.success) {
      return { success: false, error: deleteResult.error };
    }
    newBannerImageId = null;
  } else if (
    input.bannerImageFile &&
    input.bannerImageFile instanceof File &&
    input.bannerImageFile.size > 0
  ) {
    if (existing.bannerImageId) {
      const deleteResult = await deleteMedia(existing.bannerImageId);
      if (!deleteResult.success) {
        return { success: false, error: deleteResult.error };
      }
    }
    const uploadFormData = new FormData();
    uploadFormData.set('file', input.bannerImageFile);
    const uploadResult = await uploadMedia(uploadFormData);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    newBannerImageId = uploadResult.media.id;
  }

  await db
    .update(postCategories)
    .set({
      ...(input.name != null && { name: input.name.trim() }),
      ...(input.slug != null && { slug: input.slug.trim().toLowerCase() }),
      ...(input.content !== undefined && {
        content: input.content?.trim() || null
      }),
      ...(input.metaTitle !== undefined && {
        metaTitle: input.metaTitle?.trim() || null
      }),
      ...(input.metaDescription !== undefined && {
        metaDescription: input.metaDescription?.trim() || null
      }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      bannerImageId: newBannerImageId,
      updatedByAuthId: session.user.id,
      updatedAt: new Date()
    })
    .where(eq(postCategories.id, postCategoryId));

  revalidatePath('/dashboard/post-categories');
  revalidatePath(`/dashboard/post-categories/${postCategoryId}`);
  return { success: true };
}
