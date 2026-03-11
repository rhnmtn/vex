'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { media } from '@/db/drizzle-schema';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

export type CreateMediaResult =
  | { success: true; id: number; path: string }
  | { success: false; error: string };

export async function createMedia(
  formData: FormData
): Promise<CreateMediaResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u?.companyId) {
    return {
      success: false,
      error: 'Oturum bulunamadı veya şirket atanmamış.'
    };
  }

  const file = formData.get('file') as File | null;
  if (!file || !(file instanceof File)) {
    return { success: false, error: 'Dosya seçilmedi.' };
  }

  const alt = (formData.get('alt') as string)?.trim() || null;

  if (!isCloudinaryConfigured) {
    return {
      success: false,
      error: 'Cloudinary yapılandırılmamış. Ortam değişkenlerini kontrol edin.'
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
      .returning({ id: media.id, path: media.path });

    revalidatePath('/dashboard/media');
    return {
      success: true,
      id: inserted!.id,
      path: inserted!.path
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Medya yüklenirken hata oluştu.';
    return { success: false, error: message };
  }
}
