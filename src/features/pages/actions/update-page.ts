'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { pages } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  deleteMedia,
  deleteOrphanedMediaFromPageContent,
  uploadMedia
} from '@/features/media/actions/media';

export type UpdatePageInput = {
  title?: string;
  slug?: string;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive?: boolean;
  featuredImageId?: number | null;
  featuredImageFile?: File | null;
  featuredImageRemoved?: boolean;
};

export async function updatePage(
  pageId: number,
  input: UpdatePageInput
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
    .from(pages)
    .where(
      and(
        eq(pages.id, pageId),
        eq(pages.companyId, companyId),
        sql`${pages.deletedAt} IS NULL`
      )
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: 'Sayfa bulunamadı' };
  }

  if (
    input.title !== undefined &&
    input.title !== null &&
    input.title.trim().length < 2
  ) {
    return {
      success: false,
      error: 'Başlık en az 2 karakter olmalıdır'
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
    const orphanResult = await deleteOrphanedMediaFromPageContent(
      companyId,
      pageId,
      existing.content,
      input.content
    );
    if (!orphanResult.success) {
      return { success: false, error: orphanResult.error };
    }
  }

  let newFeaturedImageId: number | null = existing.featuredImageId ?? null;

  if (input.featuredImageRemoved && existing.featuredImageId) {
    const deleteResult = await deleteMedia(existing.featuredImageId);
    if (!deleteResult.success) {
      return { success: false, error: deleteResult.error };
    }
    newFeaturedImageId = null;
  } else if (
    input.featuredImageFile &&
    input.featuredImageFile instanceof File &&
    input.featuredImageFile.size > 0
  ) {
    const uploadFormData = new FormData();
    uploadFormData.set('file', input.featuredImageFile);
    const uploadResult = await uploadMedia(uploadFormData);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    newFeaturedImageId = uploadResult.media.id;
    if (
      existing.featuredImageId &&
      existing.featuredImageId !== newFeaturedImageId
    ) {
      await deleteMedia(existing.featuredImageId);
    }
  }

  await db
    .update(pages)
    .set({
      ...(input.title != null && { title: input.title.trim() }),
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
      featuredImageId: newFeaturedImageId,
      updatedByAuthId: session.user.id,
      updatedAt: new Date()
    })
    .where(eq(pages.id, pageId));

  revalidatePath('/dashboard/pages');
  revalidatePath(`/dashboard/pages/${pageId}`);
  return { success: true };
}
