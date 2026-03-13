'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { companies } from '@/db/drizzle-schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

/**
 * Oturumdaki kullanıcının şirket bilgilerini döner.
 * Kullanıcının companyId'si yoksa null döner.
 */
export async function getCompanyByUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return null;
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return null;
  }

  const [row] = await db
    .select()
    .from(companies)
    .where(
      and(eq(companies.id, companyId), sql`${companies.deletedAt} IS NULL`)
    )
    .limit(1);

  return row ?? null;
}
