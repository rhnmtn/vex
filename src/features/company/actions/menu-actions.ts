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
  parentId: number | null;
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

/** Kök öğeler, sonra her kökün alt öğeleri (sortOrder ile) */
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
  Array.from(byParent.values()).forEach((arr) =>
    arr.sort((a, b) => a.sortOrder - b.sortOrder)
  );
  return roots.flatMap((r) => [r, ...(byParent.get(r.id) ?? [])]);
}

export async function getHeaderMenuItems(): Promise<MenuItem[]> {
  const companyId = await getCompanyId();
  if (!companyId) return [];

  const rows = await db
    .select({
      id: companyHeaderMenuItems.id,
      parentId: companyHeaderMenuItems.parentId,
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
    .orderBy(
      asc(companyHeaderMenuItems.sortOrder),
      asc(companyHeaderMenuItems.id)
    );

  const items = rows.map((r) => ({
    id: r.id,
    parentId: r.parentId ?? null,
    label: r.label,
    href: r.href,
    sortOrder: r.sortOrder,
    isActive: r.isActive ?? true
  }));
  return buildOrderedMenuItems(items);
}

export async function getFooterMenuItems(): Promise<MenuItem[]> {
  const companyId = await getCompanyId();
  if (!companyId) return [];

  const rows = await db
    .select({
      id: companyFooterMenuItems.id,
      parentId: companyFooterMenuItems.parentId,
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
    .orderBy(
      asc(companyFooterMenuItems.sortOrder),
      asc(companyFooterMenuItems.id)
    );

  const items = rows.map((r) => ({
    id: r.id,
    parentId: r.parentId ?? null,
    label: r.label,
    href: r.href,
    sortOrder: r.sortOrder,
    isActive: r.isActive ?? true
  }));
  return buildOrderedMenuItems(items);
}

export async function createHeaderMenuItem(input: {
  label: string;
  href: string;
  sortOrder?: number;
  parentId?: number | null;
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
      parentId: input.parentId ?? null,
      label,
      href: href.startsWith('/') || href.startsWith('http') ? href : `/${href}`,
      sortOrder: input.sortOrder ?? 0,
      isActive: true
    })
    .returning({ id: companyHeaderMenuItems.id });

  revalidatePath('/');
  revalidatePath('/dashboard/company');
  revalidatePath('/dashboard/menu');
  return inserted?.id
    ? { success: true, id: inserted.id }
    : { success: false, error: 'Kayıt oluşturulamadı' };
}

export async function createFooterMenuItem(input: {
  label: string;
  href: string;
  sortOrder?: number;
  parentId?: number | null;
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
      parentId: input.parentId ?? null,
      label,
      href: href.startsWith('/') || href.startsWith('http') ? href : `/${href}`,
      sortOrder: input.sortOrder ?? 0,
      isActive: true
    })
    .returning({ id: companyFooterMenuItems.id });

  revalidatePath('/');
  revalidatePath('/dashboard/company');
  revalidatePath('/dashboard/menu');
  return inserted?.id
    ? { success: true, id: inserted.id }
    : { success: false, error: 'Kayıt oluşturulamadı' };
}

export async function updateHeaderMenuItem(
  id: number,
  input: {
    label?: string;
    href?: string;
    sortOrder?: number;
    parentId?: number | null;
    isActive?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  const companyId = await getCompanyId();
  if (!companyId) return { success: false, error: 'Şirket atanmamış' };

  const updates: Partial<{
    label: string;
    href: string;
    sortOrder: number;
    parentId: number | null;
    isActive: boolean;
    updatedAt: Date;
  }> = { updatedAt: new Date() };
  if (input.label !== undefined) updates.label = input.label.trim();
  if (input.href !== undefined) {
    const href = input.href.trim();
    updates.href =
      href.startsWith('/') || href.startsWith('http') ? href : `/${href}`;
  }
  if (input.sortOrder !== undefined) updates.sortOrder = input.sortOrder;
  if (input.parentId !== undefined) updates.parentId = input.parentId;
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

  revalidatePath('/');
  revalidatePath('/dashboard/company');
  revalidatePath('/dashboard/menu');
  return updated
    ? { success: true }
    : { success: false, error: 'Kayıt bulunamadı' };
}

export async function updateFooterMenuItem(
  id: number,
  input: {
    label?: string;
    href?: string;
    sortOrder?: number;
    parentId?: number | null;
    isActive?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  const companyId = await getCompanyId();
  if (!companyId) return { success: false, error: 'Şirket atanmamış' };

  const updates: Partial<{
    label: string;
    href: string;
    sortOrder: number;
    parentId: number | null;
    isActive: boolean;
    updatedAt: Date;
  }> = { updatedAt: new Date() };
  if (input.label !== undefined) updates.label = input.label.trim();
  if (input.href !== undefined) {
    const href = input.href.trim();
    updates.href =
      href.startsWith('/') || href.startsWith('http') ? href : `/${href}`;
  }
  if (input.sortOrder !== undefined) updates.sortOrder = input.sortOrder;
  if (input.parentId !== undefined) updates.parentId = input.parentId;
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

  revalidatePath('/');
  revalidatePath('/dashboard/company');
  revalidatePath('/dashboard/menu');
  return updated
    ? { success: true }
    : { success: false, error: 'Kayıt bulunamadı' };
}

export async function deleteHeaderMenuItem(
  id: number
): Promise<{ success: boolean; error?: string }> {
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

  revalidatePath('/');
  revalidatePath('/dashboard/company');
  revalidatePath('/dashboard/menu');
  return deleted
    ? { success: true }
    : { success: false, error: 'Kayıt bulunamadı' };
}

export async function reorderHeaderMenuItems(
  orderedIds: number[],
  parentUpdates?: Record<number, number | null>
): Promise<{ success: boolean; error?: string }> {
  const companyId = await getCompanyId();
  if (!companyId) return { success: false, error: 'Şirket atanmamış' };
  if (!orderedIds.length) return { success: true };

  try {
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        const id = orderedIds[i];
        const updates: {
          sortOrder: number;
          parentId?: number | null;
          updatedAt: Date;
        } = {
          sortOrder: i,
          updatedAt: new Date()
        };
        if (parentUpdates && id in parentUpdates)
          updates.parentId = parentUpdates[id];
        await tx
          .update(companyHeaderMenuItems)
          .set(updates)
          .where(
            and(
              eq(companyHeaderMenuItems.id, id),
              eq(companyHeaderMenuItems.companyId, companyId)
            )
          );
      }
    });
    revalidatePath('/');
    revalidatePath('/dashboard/company');
    revalidatePath('/dashboard/menu');
    return { success: true };
  } catch {
    return { success: false, error: 'Sıralama güncellenemedi' };
  }
}

export async function reorderFooterMenuItems(
  orderedIds: number[],
  parentUpdates?: Record<number, number | null>
): Promise<{ success: boolean; error?: string }> {
  const companyId = await getCompanyId();
  if (!companyId) return { success: false, error: 'Şirket atanmamış' };
  if (!orderedIds.length) return { success: true };

  try {
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        const id = orderedIds[i];
        const updates: {
          sortOrder: number;
          parentId?: number | null;
          updatedAt: Date;
        } = {
          sortOrder: i,
          updatedAt: new Date()
        };
        if (parentUpdates && id in parentUpdates)
          updates.parentId = parentUpdates[id];
        await tx
          .update(companyFooterMenuItems)
          .set(updates)
          .where(
            and(
              eq(companyFooterMenuItems.id, id),
              eq(companyFooterMenuItems.companyId, companyId)
            )
          );
      }
    });
    revalidatePath('/');
    revalidatePath('/dashboard/company');
    revalidatePath('/dashboard/menu');
    return { success: true };
  } catch {
    return { success: false, error: 'Sıralama güncellenemedi' };
  }
}

export async function deleteFooterMenuItem(
  id: number
): Promise<{ success: boolean; error?: string }> {
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

  revalidatePath('/');
  revalidatePath('/dashboard/company');
  revalidatePath('/dashboard/menu');
  return deleted
    ? { success: true }
    : { success: false, error: 'Kayıt bulunamadı' };
}
