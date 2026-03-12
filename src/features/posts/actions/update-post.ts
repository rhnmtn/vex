'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import {
  postCategoryAssignments,
  posts
} from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { uploadMedia, deleteMedia } from '@/features/media/actions/media';

export type UpdatePostInput = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive?: boolean;
  isSticky?: boolean;
  publishedAt?: Date | null;
  categoryIds?: number[];
  featuredImageId?: number | null;
  featuredImageFile?: File | null;
  featuredImageRemoved?: boolean;
};

export async function updatePost(
  postId: number,
  input: UpdatePostInput
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
    .from(posts)
    .where(
      and(
        eq(posts.id, postId),
        eq(posts.companyId, companyId),
        sql`${posts.deletedAt} IS NULL`
      )
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: 'Yazı bulunamadı' };
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
    if (existing.featuredImageId) {
      const deleteResult = await deleteMedia(existing.featuredImageId);
      if (!deleteResult.success) {
        return { success: false, error: deleteResult.error };
      }
    }
    const uploadFormData = new FormData();
    uploadFormData.set('file', input.featuredImageFile);
    const uploadResult = await uploadMedia(uploadFormData);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    newFeaturedImageId = uploadResult.media.id;
  }

  await db
    .update(posts)
    .set({
      ...(input.title != null && { title: input.title.trim() }),
      ...(input.slug != null && { slug: input.slug.trim().toLowerCase() }),
      ...(input.excerpt !== undefined && {
        excerpt: input.excerpt?.trim() || null
      }),
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
      ...(input.isSticky !== undefined && { isSticky: input.isSticky }),
      ...(input.publishedAt !== undefined && {
        publishedAt: input.publishedAt
      }),
      featuredImageId: newFeaturedImageId,
      updatedByAuthId: session.user.id,
      updatedAt: new Date()
    })
    .where(eq(posts.id, postId));

  if (input.categoryIds !== undefined) {
    await db
      .delete(postCategoryAssignments)
      .where(eq(postCategoryAssignments.postId, postId));

    const categoryIds = input.categoryIds.filter((id) => id > 0);
    if (categoryIds.length > 0) {
      await db.insert(postCategoryAssignments).values(
        categoryIds.map((categoryId) => ({
          postId,
          categoryId
        }))
      );
    }
  }

  revalidatePath('/dashboard/posts');
  revalidatePath(`/dashboard/posts/${postId}`);
  return { success: true };
}
