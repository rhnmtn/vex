'use server';

import { auth, type SessionUserWithCompany } from '@/lib/auth';
import { db } from '@/db';
import {
  companyHeaderMenuItems,
  companyFooterMenuItems
} from '@/db/drizzle-schema';
import { and, asc, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type MenuItem = {
  id: number;
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean | null;
};

async function getCompanyId(): Promise<number | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  return (session.user as SessionUserWithCompany).companyId ?? null;
}

export async function getHeaderMenuItems(): Promise<MenuItem[]> {
  const companyId = await getCompanyId();
  if (!companyId) return [];

  const rows = await db
    .select({
      id: companyHeaderMenuItems.id,
      label: companyHeaderMenuItems.label,
      href: companyHeaderMenuItems.href,
      sortOrder: companyHeaderMenuItems.sortOrder,
      isActive: companyHeaderMenuItems.isActive
    })
    .from(companyHeaderMenuItems)
    .where(
      and(
        eq(companyHeaderMenuItems.companyId, companyId),
        sql`${companyHeaderMenuItems.deletedAt} IS NULL`
      )
    )
    .orderBy(asc(companyHeaderMenuItems.sortOrder), asc(companyHeaderMenuItems.id));

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    href: r.href,
    sortOrder: r.sortOrder,
    isActive: r.isActive ?? true
  }));
}

export async function getFooterMenuItems(): Promise<MenuItem[]> {
  const companyId = await getCompanyId();
  if (!companyId) return [];

  const rows = await db
    .select({
      id: companyFooterMenuItems.id,
      label: companyFooterMenuItems.label,
      href: companyFooterMenuItems.href,
      sortOrder: companyFooterMenuItems.sortOrder,
      isActive: companyFooterMenuItems.isActive
    })
    .from(companyFooterMenuItems)
    .where(
      and(
        eq(companyFooterMenuItems.companyId, companyId),
        sql`${companyFooterMenuItems.deletedAt} IS NULL`
      )
    )
    .orderBy(asc(companyFooterMenuItems.sortOrder), asc(companyFooterMenuItems.id));

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    href: r.href,
    sortOrder: r.sortOrder,
    isActive: r.isActive ?? true
  }));
}

export async function createHeaderMenuItem(input: {
  label: string;
  href: string;
  sortOrder?: number;
}): Promise<{ success: boolean; id?: number; error?: string }> {
  const companyId = await getCompanyId();
  if (!companyId) return { success: false, error: 'Şirket atanmamış' };

  const label = input.label?.trim();
  const href = input.href?.trim();
  if (!label || label.length < 1)
    return { success: false, error: 'Etiket gerekli' };
  if (!href || href.length < 1)
    return { success: false, error: 'Link gerekli' };

  const [inserted] = await db
    .insert(companyHeaderMenuItems)
    .values({
      companyId,
      label,
      href: href.startsWith('/') || href.startsWith('http') ? href : `/${href}`,
      sortOrder: input.sortOrder ?? 0,
      isActive: true
    })
    .returning({ id: companyHeaderMenuItems.id });

  revalidatePath('/dashboard/company');
  return inserted?.id ? { success: true, id: inserted.id } : { success: false, error: 'Kayıt oluşturulamadı' };
}

export async function createFooterMenuItem(input: {
  label: string;
  href: string;
  sortOrder?: number;
}): Promise<{ success: boolean; id?: number; error?: string }> {
  const companyId = await getCompanyId();
  if (!companyId) return { success: false, error: 'Şirket atanmamış' };

  const label = input.label?.trim();
  const href = input.href?.trim();
  if (!label || label.length < 1)
    return { success: false, error: 'Etiket gerekli' };
  if (!href || href.length < 1)
    return { success: false, error: 'Link gerekli' };

  const [inserted] = await db
    .insert(companyFooterMenuItems)
    .values({
      companyId,
      label,
      href: href.startsWith('/') || href.startsWith('http') ? href : `/${href}`,
      sortOrder: input.sortOrder ?? 0,
      isActive: true
    })
    .returning({ id: companyFooterMenuItems.id });

  revalidatePath('/dashboard/company');
  return inserted?.id ? { success: true, id: inserted.id } : { success: false, error: 'Kayıt oluşturulamadı' };
}

export async function updateHeaderMenuItem(
  id: number,
  input: { label?: string; href?: string; sortOrder?: number; isActive?: boolean }
): Promise<{ success: boolean; error?: string }> {
  const companyId = await getCompanyId();
  if (!companyId) return { success: false, error: 'Şirket atanmamış' };

  const updates: Partial<{
    label: string;
    href: string;
    sortOrder: number;
    isActive: boolean;
    updatedAt: Date;
  }> = { updatedAt: new Date() };
  if (input.label !== undefined) updates.label = input.label.trim();
  if (input.href !== undefined) {
    const href = input.href.trim();
    updates.href = href.startsWith('/') || href.startsWith('http') ? href : `/${href}`;
  }
  if (input.sortOrder !== undefined) updates.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) updates.isActive = input.isActive;

  const [updated] = await db
    .update(companyHeaderMenuItems)
    .set(updates)
    .where(
      and(
        eq(companyHeaderMenuItems.id, id),
        eq(companyHeaderMenuItems.companyId, companyId)
      )
    )
    .returning({ id: companyHeaderMenuItems.id });

  revalidatePath('/dashboard/company');
  return updated ? { success: true } : { success: false, error: 'Kayıt bulunamadı' };
}

export async function updateFooterMenuItem(
  id: number,
  input: { label?: string; href?: string; sortOrder?: number; isActive?: boolean }
): Promise<{ success: boolean; error?: string }> {
  const companyId = await getCompanyId();
  if (!companyId) return { success: false, error: 'Şirket atanmamış' };

  const updates: Partial<{
    label: string;
    href: string;
    sortOrder: number;
    isActive: boolean;
    updatedAt: Date;
  }> = { updatedAt: new Date() };
  if (input.label !== undefined) updates.label = input.label.trim();
  if (input.href !== undefined) {
    const href = input.href.trim();
    updates.href = href.startsWith('/') || href.startsWith('http') ? href : `/${href}`;
  }
  if (input.sortOrder !== undefined) updates.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) updates.isActive = input.isActive;

  const [updated] = await db
    .update(companyFooterMenuItems)
    .set(updates)
    .where(
      and(
        eq(companyFooterMenuItems.id, id),
        eq(companyFooterMenuItems.companyId, companyId)
      )
    )
    .returning({ id: companyFooterMenuItems.id });

  revalidatePath('/dashboard/company');
  return updated ? { success: true } : { success: false, error: 'Kayıt bulunamadı' };
}

export async function deleteHeaderMenuItem(id: number): Promise<{ success: boolean; error?: string }> {
  const companyId = await getCompanyId();
  if (!companyId) return { success: false, error: 'Şirket atanmamış' };

  const [deleted] = await db
    .update(companyHeaderMenuItems)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(companyHeaderMenuItems.id, id),
        eq(companyHeaderMenuItems.companyId, companyId)
      )
    )
    .returning({ id: companyHeaderMenuItems.id });

  revalidatePath('/dashboard/company');
  return deleted ? { success: true } : { success: false, error: 'Kayıt bulunamadı' };
}

export async function deleteFooterMenuItem(id: number): Promise<{ success: boolean; error?: string }> {
  const companyId = await getCompanyId();
  if (!companyId) return { success: false, error: 'Şirket atanmamış' };

  const [deleted] = await db
    .update(companyFooterMenuItems)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(companyFooterMenuItems.id, id),
        eq(companyFooterMenuItems.companyId, companyId)
      )
    )
    .returning({ id: companyFooterMenuItems.id });

  revalidatePath('/dashboard/company');
  return deleted ? { success: true } : { success: false, error: 'Kayıt bulunamadı' };
}
