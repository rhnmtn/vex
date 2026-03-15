'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { pages } from '@/db/drizzle-schema';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { uploadMedia } from '@/features/media/actions/media';

export type CreatePageInput = {
  title: string;
  slug: string;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive?: boolean;
  featuredImageFile?: File | null;
};

export async function createPage(
  input: CreatePageInput
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
    .insert(pages)
    .values({
      companyId,
      createdByAuthId: authId,
      updatedByAuthId: authId,
      title: input.title.trim(),
      slug: input.slug.trim().toLowerCase(),
      content: input.content?.trim() || null,
      metaTitle: input.metaTitle?.trim() || null,
      metaDescription: input.metaDescription?.trim() || null,
      isActive: input.isActive ?? true,
      featuredImageId
    })
    .returning({ id: pages.id });

  revalidatePath('/dashboard/pages');
  if (!inserted?.id) {
    return { success: false, error: 'Kayıt oluşturulamadı' };
  }
  return { success: true, id: inserted.id };
}
