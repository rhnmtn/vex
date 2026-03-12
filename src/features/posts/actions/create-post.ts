'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import {
  postCategoryAssignments,
  posts
} from '@/db/drizzle-schema';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { uploadMedia } from '@/features/media/actions/media';

export type CreatePostInput = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive?: boolean;
  isSticky?: boolean;
  publishedAt?: Date | null;
  categoryIds?: number[];
  featuredImageFile?: File | null;
};

export async function createPost(
  input: CreatePostInput
): Promise<{ success: boolean; id?: number; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Oturum gerekli' };
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return { success: false, error: 'Şirket atanmamış' };
  }

  if (!input.title?.trim() || input.title.trim().length < 2) {
    return {
      success: false,
      error: 'Başlık en az 2 karakter olmalıdır'
    };
  }

  if (!input.slug?.trim() || input.slug.trim().length < 2) {
    return {
      success: false,
      error: 'Slug en az 2 karakter olmalıdır'
    };
  }

  const authId = session.user.id;
  let featuredImageId: number | null = null;

  if (
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
    featuredImageId = uploadResult.media.id;
  }

  const [inserted] = await db
    .insert(posts)
    .values({
      companyId,
      createdByAuthId: authId,
      updatedByAuthId: authId,
      title: input.title.trim(),
      slug: input.slug.trim().toLowerCase(),
      excerpt: input.excerpt?.trim() || null,
      content: input.content?.trim() || null,
      metaTitle: input.metaTitle?.trim() || null,
      metaDescription: input.metaDescription?.trim() || null,
      isActive: input.isActive ?? true,
      isSticky: input.isSticky ?? false,
      publishedAt: input.publishedAt ?? null,
      featuredImageId
    })
    .returning({ id: posts.id });

  if (!inserted?.id) {
    return { success: false, error: 'Kayıt oluşturulamadı' };
  }

  const categoryIds = input.categoryIds?.filter((id) => id > 0) ?? [];
  if (categoryIds.length > 0) {
    await db.insert(postCategoryAssignments).values(
      categoryIds.map((categoryId) => ({
        postId: inserted.id,
        categoryId
      }))
    );
  }

  revalidatePath('/dashboard/posts');
  return { success: true, id: inserted.id };
}
