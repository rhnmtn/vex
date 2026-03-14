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

/**
 * PUBLIC_WEB_COMPANY_ID env ile belirlenen veya ilk şirketin ID'sini döner.
 * (web) route grubunda DB sorguları için companyId gerektiğinde kullanın.
 */
export async function getWebCompanyId(): Promise<number | null> {
  const company = await getWebCompany();
  return company?.id ?? null;
}

/**
 * PUBLIC_WEB_COMPANY_ID env ile belirlenen veya ilk şirketin bilgilerini döner.
 * (web) route grubundaki tüm public veriler bu şirkete göre filtrelenir.
 */
export async function getWebCompany(): Promise<WebCompany | null> {
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
}

/** Web şirketinin header menü öğelerini döner (ağaç yapısı, kökten alt menüye sıralı). */
export async function getWebHeaderMenuItems(): Promise<WebMenuItem[]> {
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
}

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
  for (const arr of byParent.values())
    arr.sort((a, b) => a.sortOrder - b.sortOrder);

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

function buildOrderedMenuItems<
  T extends { id: number; parentId: number | null; sortOrder: number }
>(items: T[]): T[] {
  const roots = items
    .filter((i) => !i.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const byParent = new Map<number, T[]>();
  for (const i of items) {
    if (i.parentId) {
      const arr = byParent.get(i.parentId) ?? [];
      arr.push(i);
      byParent.set(i.parentId, arr);
    }
  }
  for (const arr of byParent.values())
    arr.sort((a, b) => a.sortOrder - b.sortOrder);
  return roots.flatMap((r) => [r, ...(byParent.get(r.id) ?? [])]);
}

/** Web şirketinin footer menü öğelerini döner (kökten alt menüye sıralı). */
export async function getWebFooterMenuItems(): Promise<WebMenuItem[]> {
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
}
