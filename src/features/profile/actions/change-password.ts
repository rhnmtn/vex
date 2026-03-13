'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Oturumdaki kullanıcının kendi şifresini değiştirir.
 * Better Auth changePassword API kullanır.
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Oturum gerekli' };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword
      },
      headers: await headers()
    });
    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard/profile/password');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Şifre güncellenemedi';
    return { success: false, error: message };
  }
}
