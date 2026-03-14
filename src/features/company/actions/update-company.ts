'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { companies } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { uploadMedia, deleteMedia } from '@/features/media/actions/media';

export type UpdateCompanyInput = {
  name?: string;
  shortName?: string;
  taxOffice?: string;
  taxNumber?: string;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  website?: string | null;
  description?: string | null;
  isActive?: boolean;
  logoLightMediaId?: number | null;
  logoLightFile?: File | null;
  logoLightRemoved?: boolean;
  logoDarkMediaId?: number | null;
  logoDarkFile?: File | null;
  logoDarkRemoved?: boolean;
  heroImageMediaId?: number | null;
  heroImageFile?: File | null;
  heroRemoved?: boolean;
  heroText?: string | null;
  heroSubtitle?: string | null;
};

export async function updateCompany(
  input: UpdateCompanyInput
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
    .from(companies)
    .where(
      and(eq(companies.id, companyId), sql`${companies.deletedAt} IS NULL`)
    )
    .limit(1);

  if (!existing) {
    return { success: false, error: 'Şirket bulunamadı' };
  }

  if (
    input.name !== undefined &&
    input.name !== null &&
    input.name.trim().length < 2
  ) {
    return {
      success: false,
      error: 'Şirket adı en az 2 karakter olmalıdır'
    };
  }

  if (
    input.shortName !== undefined &&
    input.shortName !== null &&
    input.shortName.trim().length < 2
  ) {
    return {
      success: false,
      error: 'Kısa ad en az 2 karakter olmalıdır'
    };
  }

  let newLogoLightMediaId: number | null = existing.logoLightMediaId ?? null;
  let newLogoDarkMediaId: number | null = existing.logoDarkMediaId ?? null;
  let newHeroImageMediaId: number | null = existing.heroImageMediaId ?? null;

  if (input.logoLightRemoved && existing.logoLightMediaId) {
    const deleteResult = await deleteMedia(existing.logoLightMediaId);
    if (!deleteResult.success) return { success: false, error: deleteResult.error };
    newLogoLightMediaId = null;
  } else if (
    input.logoLightFile &&
    input.logoLightFile instanceof File &&
    input.logoLightFile.size > 0
  ) {
    if (existing.logoLightMediaId) {
      const deleteResult = await deleteMedia(existing.logoLightMediaId);
      if (!deleteResult.success) return { success: false, error: deleteResult.error };
    }
    const uploadFormData = new FormData();
    uploadFormData.set('file', input.logoLightFile);
    const uploadResult = await uploadMedia(uploadFormData);
    if (!uploadResult.success) return { success: false, error: uploadResult.error };
    newLogoLightMediaId = uploadResult.media.id;
  }

  if (input.logoDarkRemoved && existing.logoDarkMediaId) {
    const deleteResult = await deleteMedia(existing.logoDarkMediaId);
    if (!deleteResult.success) return { success: false, error: deleteResult.error };
    newLogoDarkMediaId = null;
  } else if (
    input.logoDarkFile &&
    input.logoDarkFile instanceof File &&
    input.logoDarkFile.size > 0
  ) {
    if (existing.logoDarkMediaId) {
      const deleteResult = await deleteMedia(existing.logoDarkMediaId);
      if (!deleteResult.success) return { success: false, error: deleteResult.error };
    }
    const uploadFormData = new FormData();
    uploadFormData.set('file', input.logoDarkFile);
    const uploadResult = await uploadMedia(uploadFormData);
    if (!uploadResult.success) return { success: false, error: uploadResult.error };
    newLogoDarkMediaId = uploadResult.media.id;
  }

  if (input.heroRemoved && existing.heroImageMediaId) {
    const deleteResult = await deleteMedia(existing.heroImageMediaId);
    if (!deleteResult.success) return { success: false, error: deleteResult.error };
    newHeroImageMediaId = null;
  } else if (
    input.heroImageFile &&
    input.heroImageFile instanceof File &&
    input.heroImageFile.size > 0
  ) {
    if (existing.heroImageMediaId) {
      const deleteResult = await deleteMedia(existing.heroImageMediaId);
      if (!deleteResult.success) return { success: false, error: deleteResult.error };
    }
    const uploadFormData = new FormData();
    uploadFormData.set('file', input.heroImageFile);
    const uploadResult = await uploadMedia(uploadFormData);
    if (!uploadResult.success) return { success: false, error: uploadResult.error };
    newHeroImageMediaId = uploadResult.media.id;
  }

  await db
    .update(companies)
    .set({
      ...(input.name != null && { name: input.name }),
      ...(input.shortName != null && { shortName: input.shortName }),
      ...(input.taxOffice != null && { taxOffice: input.taxOffice }),
      ...(input.taxNumber != null && { taxNumber: input.taxNumber }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.district !== undefined && { district: input.district }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.mobile !== undefined && { mobile: input.mobile }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.website !== undefined && { website: input.website }),
      ...(input.description !== undefined && {
        description: input.description
      }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      logoLightMediaId: newLogoLightMediaId,
      logoDarkMediaId: newLogoDarkMediaId,
      heroImageMediaId: newHeroImageMediaId,
      ...(input.heroText !== undefined && { heroText: input.heroText?.trim() || null }),
      ...(input.heroSubtitle !== undefined && { heroSubtitle: input.heroSubtitle?.trim() || null }),
      updatedByAuthId: session.user.id,
      updatedAt: new Date()
    })
    .where(eq(companies.id, companyId));

  revalidatePath('/dashboard/company');
  return { success: true };
}
