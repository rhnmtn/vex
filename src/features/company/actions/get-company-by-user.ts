'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { companies, media } from '@/db/drizzle-schema';
import { alias } from 'drizzle-orm/pg-core';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

const logoLightMedia = alias(media, 'logo_light_media');
const logoDarkMedia = alias(media, 'logo_dark_media');
const heroMedia = alias(media, 'hero_media');

export type CompanyWithMedia = {
  id: number;
  name: string;
  shortName: string;
  taxOffice: string;
  taxNumber: string;
  address: string | null;
  city: string | null;
  district: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  isActive: boolean | null;
  logoLightMediaId: number | null;
  logoLightPath: string | null;
  logoDarkMediaId: number | null;
  logoDarkPath: string | null;
  heroImageMediaId: number | null;
  heroImagePath: string | null;
  heroText: string | null;
  heroSubtitle: string | null;
};

/**
 * Oturumdaki kullanıcının şirket bilgilerini döner.
 * Kullanıcının companyId'si yoksa null döner.
 */
export async function getCompanyByUser(): Promise<CompanyWithMedia | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) return null;

  const [row] = await db
    .select({
      id: companies.id,
      name: companies.name,
      shortName: companies.shortName,
      taxOffice: companies.taxOffice,
      taxNumber: companies.taxNumber,
      address: companies.address,
      city: companies.city,
      district: companies.district,
      phone: companies.phone,
      mobile: companies.mobile,
      email: companies.email,
      website: companies.website,
      description: companies.description,
      isActive: companies.isActive,
      logoLightMediaId: companies.logoLightMediaId,
      logoLightPath: logoLightMedia.path,
      logoDarkMediaId: companies.logoDarkMediaId,
      logoDarkPath: logoDarkMedia.path,
      heroImageMediaId: companies.heroImageMediaId,
      heroImagePath: heroMedia.path,
      heroText: companies.heroText,
      heroSubtitle: companies.heroSubtitle
    })
    .from(companies)
    .leftJoin(logoLightMedia, eq(companies.logoLightMediaId, logoLightMedia.id))
    .leftJoin(logoDarkMedia, eq(companies.logoDarkMediaId, logoDarkMedia.id))
    .leftJoin(heroMedia, eq(companies.heroImageMediaId, heroMedia.id))
    .where(
      and(eq(companies.id, companyId), sql`${companies.deletedAt} IS NULL`)
    )
    .limit(1);

  if (!row) return null;

  return {
    ...row,
    address: row.address ?? null,
    city: row.city ?? null,
    district: row.district ?? null,
    phone: row.phone ?? null,
    mobile: row.mobile ?? null,
    email: row.email ?? null,
    website: row.website ?? null,
    description: row.description ?? null,
    isActive: row.isActive ?? true,
    logoLightMediaId: row.logoLightMediaId ?? null,
    logoLightPath: row.logoLightPath ?? null,
    logoDarkMediaId: row.logoDarkMediaId ?? null,
    logoDarkPath: row.logoDarkPath ?? null,
    heroImageMediaId: row.heroImageMediaId ?? null,
    heroImagePath: row.heroImagePath ?? null,
    heroText: row.heroText ?? null,
    heroSubtitle: row.heroSubtitle ?? null
  };
}
