'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import { customers } from '@/db/drizzle-schema';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

/** Filtre parametreleri. companyId her zaman session'dan alınır (multi-tenant güvenlik). */
export type GetCustomersFilters = {
  page?: number;
  limit?: number;
  name?: string;
};

export type CustomerRow = {
  id: number;
  name: string;
  contactName: string | null;
  mobile: string | null;
  email: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  taxOffice: string | null;
  taxNumber: string | null;
  description: string | null;
  isActive: boolean;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GetCustomersResult = {
  customers: CustomerRow[];
  total: number;
};

export async function getCustomers(
  filters: GetCustomersFilters = {}
): Promise<GetCustomersResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Oturum gerekli');
  }

  const companyId = (session.user as SessionUserWithCompany).companyId;
  if (companyId == null) {
    return { customers: [], total: 0 };
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  const conditions = [
    eq(customers.companyId, companyId),
    sql`${customers.deletedAt} IS NULL`
  ];

  if (filters.name?.trim()) {
    conditions.push(
      or(
        ilike(customers.name, `%${filters.name.trim()}%`),
        ilike(customers.contactName, `%${filters.name.trim()}%`),
        ilike(customers.email, `%${filters.name.trim()}%`),
        ilike(customers.mobile, `%${filters.name.trim()}%`)
      )!
    );
  }

  const whereClause = and(...conditions);

  const [rows, countResult] = await Promise.all([
    db
      .select({
        id: customers.id,
        name: customers.name,
        contactName: customers.contactName,
        mobile: customers.mobile,
        email: customers.email,
        city: customers.city,
        district: customers.district,
        address: customers.address,
        taxOffice: customers.taxOffice,
        taxNumber: customers.taxNumber,
        description: customers.description,
        isActive: customers.isActive,
        companyId: customers.companyId,
        createdAt: customers.createdAt,
        updatedAt: customers.updatedAt
      })
      .from(customers)
      .where(whereClause)
      .orderBy(desc(customers.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(customers)
      .where(whereClause)
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    customers: rows.map((r) => ({
      ...r,
      contactName: r.contactName ?? null,
      mobile: r.mobile ?? null,
      email: r.email ?? null,
      city: r.city ?? null,
      district: r.district ?? null,
      address: r.address ?? null,
      taxOffice: r.taxOffice ?? null,
      taxNumber: r.taxNumber ?? null,
      description: r.description ?? null,
      isActive: r.isActive ?? true,
      createdAt: r.createdAt ?? new Date(),
      updatedAt: r.updatedAt ?? new Date()
    })),
    total
  };
}
