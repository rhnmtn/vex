'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { postCategories } from '@/db/drizzle-schema';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { uploadMedia } from '@/features/media/actions/media';

export type CreatePostCategoryInput = {
  name: string;
  slug: string;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive?: boolean;
  bannerImageFile?: File | null;
};

export async function createPostCategory(
  input: CreatePostCategoryInput
): Promise<{ success: boolean; id?: number; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Oturum gerekli' };
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return { success: false, error: 'Şirket atanmamış' };
  }

  if (!input.name?.trim() || input.name.trim().length < 2) {
    return {
      success: false,
      error: 'Kategori adı en az 2 karakter olmalıdır'
    };
  }

  if (!input.slug?.trim() || input.slug.trim().length < 2) {
    return {
      success: false,
      error: 'Slug en az 2 karakter olmalıdır'
    };
  }

  const authId = session.user.id;
  let bannerImageId: number | null = null;

  if (input.bannerImageFile && input.bannerImageFile instanceof File && input.bannerImageFile.size > 0) {
    const uploadFormData = new FormData();
    uploadFormData.set('file', input.bannerImageFile);
    const uploadResult = await uploadMedia(uploadFormData);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    bannerImageId = uploadResult.media.id;
  }

  const [inserted] = await db
    .insert(postCategories)
    .values({
      companyId,
      createdByAuthId: authId,
      updatedByAuthId: authId,
      name: input.name.trim(),
      slug: input.slug.trim().toLowerCase(),
      content: input.content?.trim() || null,
      metaTitle: input.metaTitle?.trim() || null,
      metaDescription: input.metaDescription?.trim() || null,
      isActive: input.isActive ?? true,
      bannerImageId
    })
    .returning({ id: postCategories.id });

  revalidatePath('/dashboard/post-categories');
  if (!inserted?.id) {
    return { success: false, error: 'Kayıt oluşturulamadı' };
  }
  return { success: true, id: inserted.id };
}
