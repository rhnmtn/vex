'use server';

import { auth, getSessionUser } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u) {
    return { success: false, error: 'Oturum gerekli' };
  }

  if (u.role !== 'ADMIN') {
    return { success: false, error: 'Bu işlem için admin yetkisi gerekli' };
  }

  try {
    await auth.api.setUserPassword({
      body: {
        userId,
        newPassword
      },
      headers: await headers()
    });
    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${userId}`);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Şifre güncellenemedi';
    return { success: false, error: message };
  }
}
