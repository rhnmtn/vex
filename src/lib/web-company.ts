import { db } from '@/db';
import { companies } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';

export type WebCompany = {
  id: number;
  name: string;
  shortName: string;
  description: string | null;
  logo: string | null;
  logoAlt: string | null;
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

  const [row] = envCompanyId
    ? await db
        .select({
          id: companies.id,
          name: companies.name,
          shortName: companies.shortName,
          description: companies.description,
          logo: companies.logo,
          logoAlt: companies.logoAlt,
          website: companies.website,
          email: companies.email,
          phone: companies.phone
        })
        .from(companies)
        .where(
          and(
            eq(companies.id, envCompanyId),
            sql`${companies.deletedAt} IS NULL`
          )
        )
        .limit(1)
    : await db
        .select({
          id: companies.id,
          name: companies.name,
          shortName: companies.shortName,
          description: companies.description,
          logo: companies.logo,
          logoAlt: companies.logoAlt,
          website: companies.website,
          email: companies.email,
          phone: companies.phone
        })
        .from(companies)
        .where(sql`${companies.deletedAt} IS NULL`)
        .limit(1);

  return row
    ? {
        ...row,
        description: row.description ?? null,
        logo: row.logo ?? null,
        logoAlt: row.logoAlt ?? null,
        website: row.website ?? null,
        email: row.email ?? null,
        phone: row.phone ?? null
      }
    : null;
}
