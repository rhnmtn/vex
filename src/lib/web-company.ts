import { cache } from 'react';
import { db } from '@/db';
import {
  companies,
  companyHeaderMenuItems,
  companyFooterMenuItems,
  media
} from '@/db/drizzle-schema';
import { alias } from 'drizzle-orm/pg-core';
import { and, asc, eq, sql } from 'drizzle-orm';

export type WebMenuItem = {
  label: string;
  href: string;
  children?: WebMenuItem[];
};

/** Ağaç yapısını düz listeye çevirir (kök, alt, alt... sırasıyla). */
export function flattenMenuItems(items: WebMenuItem[]): WebMenuItem[] {
  return items.flatMap((item) =>
    item.children?.length ? [item, ...flattenMenuItems(item.children)] : [item]
  );
}

const logoLightMedia = alias(media, 'logo_light_media');
const logoDarkMedia = alias(media, 'logo_dark_media');
const heroMedia = alias(media, 'hero_media');

export type WebCompany = {
  id: number;
  name: string;
  shortName: string;
  description: string | null;
  logo: string | null;
  logoLight: string | null;
  logoDark: string | null;
  logoAlt: string | null;
  heroImage: string | null;
  heroText: string | null;
  heroSubtitle: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
};

function getWebCompanyIdFromEnv(): number | null {
  const envId = process.env.PUBLIC_WEB_COMPANY_ID;
  if (!envId?.trim()) return null;
  const id = parseInt(envId.trim(), 10);
  return Number.isNaN(id) || id <= 0 ? null : id;
}

export type WebLayoutData = {
  company: WebCompany | null;
  headerMenuItems: WebMenuItem[];
  footerMenuItems: WebMenuItem[];
};

/**
 * Web alanında company, header ve footer verilerini tek istekte döner.
 * React cache() ile request bazında global tutulur.
 */
export const getWebLayoutData = cache(async (): Promise<WebLayoutData> => {
  const [company, headerMenuItems, footerMenuItems] = await Promise.all([
    getWebCompany(),
    getWebHeaderMenuItems(),
    getWebFooterMenuItems()
  ]);
  return { company, headerMenuItems, footerMenuItems };
});

/**
 * PUBLIC_WEB_COMPANY_ID env ile belirlenen veya ilk şirketin ID'sini döner.
 */
export async function getWebCompanyId(): Promise<number | null> {
  const company = await getWebCompany();
  return company?.id ?? null;
}

/**
 * PUBLIC_WEB_COMPANY_ID env ile belirlenen veya ilk şirketin bilgilerini döner.
 * Request bazında cache'lenir (getWebLayoutData ile paylaşılır).
 */
export const getWebCompany = cache(async (): Promise<WebCompany | null> => {
  const envCompanyId = getWebCompanyIdFromEnv();

  const selectFields = {
    id: companies.id,
    name: companies.name,
    shortName: companies.shortName,
    description: companies.description,
    logo: companies.logo,
    logoAlt: companies.logoAlt,
    logoLightPath: logoLightMedia.path,
    logoDarkPath: logoDarkMedia.path,
    heroMediaPath: heroMedia.path,
    heroText: companies.heroText,
    heroSubtitle: companies.heroSubtitle,
    website: companies.website,
    email: companies.email,
    phone: companies.phone
  };

  const [row] = envCompanyId
    ? await db
        .select(selectFields)
        .from(companies)
        .leftJoin(
          logoLightMedia,
          eq(companies.logoLightMediaId, logoLightMedia.id)
        )
        .leftJoin(
          logoDarkMedia,
          eq(companies.logoDarkMediaId, logoDarkMedia.id)
        )
        .leftJoin(heroMedia, eq(companies.heroImageMediaId, heroMedia.id))
        .where(
          and(
            eq(companies.id, envCompanyId),
            sql`${companies.deletedAt} IS NULL`
          )
        )
        .limit(1)
    : await db
        .select(selectFields)
        .from(companies)
        .leftJoin(
          logoLightMedia,
          eq(companies.logoLightMediaId, logoLightMedia.id)
        )
        .leftJoin(
          logoDarkMedia,
          eq(companies.logoDarkMediaId, logoDarkMedia.id)
        )
        .leftJoin(heroMedia, eq(companies.heroImageMediaId, heroMedia.id))
        .where(sql`${companies.deletedAt} IS NULL`)
        .limit(1);

  return row
    ? {
        id: row.id,
        name: row.name,
        shortName: row.shortName,
        description: row.description ?? null,
        logo: row.logoLightPath ?? row.logoDarkPath ?? row.logo ?? null,
        logoLight: row.logoLightPath ?? null,
        logoDark: row.logoDarkPath ?? null,
        logoAlt: row.logoAlt ?? null,
        heroImage: row.heroMediaPath ?? null,
        heroText: row.heroText ?? null,
        heroSubtitle: row.heroSubtitle ?? null,
        website: row.website ?? null,
        email: row.email ?? null,
        phone: row.phone ?? null
      }
    : null;
});

/** Web şirketinin header menü öğelerini döner (ağaç yapısı, kökten alt menüye sıralı). */
export const getWebHeaderMenuItems = cache(async (): Promise<WebMenuItem[]> => {
  const companyId = await getWebCompanyId();
  if (!companyId) return [];

  const rows = await db
    .select({
      id: companyHeaderMenuItems.id,
      parentId: companyHeaderMenuItems.parentId,
      label: companyHeaderMenuItems.label,
      href: companyHeaderMenuItems.href,
      sortOrder: companyHeaderMenuItems.sortOrder
    })
    .from(companyHeaderMenuItems)
    .where(
      and(
        eq(companyHeaderMenuItems.companyId, companyId),
        eq(companyHeaderMenuItems.isActive, true),
        sql`${companyHeaderMenuItems.deletedAt} IS NULL`
      )
    )
    .orderBy(
      asc(companyHeaderMenuItems.sortOrder),
      asc(companyHeaderMenuItems.id)
    );

  return buildMenuTree(rows);
});

function buildMenuTree(
  rows: {
    id: number;
    parentId: number | null;
    label: string;
    href: string;
    sortOrder: number;
  }[]
): WebMenuItem[] {
  const roots = rows
    .filter((r) => !r.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const byParent = new Map<number, typeof rows>();
  for (const r of rows) {
    if (r.parentId) {
      const arr = byParent.get(r.parentId) ?? [];
      arr.push(r);
      byParent.set(r.parentId, arr);
    }
  }
  Array.from(byParent.values()).forEach((arr) =>
    arr.sort((a, b) => a.sortOrder - b.sortOrder)
  );

  function toNode(row: (typeof rows)[0]): WebMenuItem {
    const children = (byParent.get(row.id) ?? []).map(toNode);
    return {
      label: row.label,
      href: row.href,
      ...(children.length > 0 ? { children } : {})
    };
  }
  return roots.map(toNode);
}

/** Web şirketinin footer menü öğelerini döner (kökten alt menüye sıralı). */
export const getWebFooterMenuItems = cache(async (): Promise<WebMenuItem[]> => {
  const companyId = await getWebCompanyId();
  if (!companyId) return [];

  const rows = await db
    .select({
      id: companyFooterMenuItems.id,
      parentId: companyFooterMenuItems.parentId,
      label: companyFooterMenuItems.label,
      href: companyFooterMenuItems.href,
      sortOrder: companyFooterMenuItems.sortOrder
    })
    .from(companyFooterMenuItems)
    .where(
      and(
        eq(companyFooterMenuItems.companyId, companyId),
        eq(companyFooterMenuItems.isActive, true),
        sql`${companyFooterMenuItems.deletedAt} IS NULL`
      )
    )
    .orderBy(
      asc(companyFooterMenuItems.sortOrder),
      asc(companyFooterMenuItems.id)
    );

  return buildMenuTree(rows);
});
