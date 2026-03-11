'use server';

import { hashPassword } from 'better-auth/crypto';
import { generateRandomString } from 'better-auth/crypto';
import { auth, getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { user, account } from '@/db/drizzle-schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { uploadMedia } from '@/features/media/actions/media';

export async function createUser(
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  if (!u) {
    return { success: false, error: 'Oturum gerekli' };
  }
  if (u.role !== 'ADMIN') {
    return { success: false, error: 'Bu işlem için admin yetkisi gerekli' };
  }
  if (u.companyId == null) {
    return { success: false, error: 'Şirket atanmamış' };
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase() ?? '';
  const password = formData.get('password') as string;
  const name = (formData.get('name') as string)?.trim() ?? '';
  const title = (formData.get('title') as string)?.trim() || null;
  const phone = (formData.get('phone') as string)?.trim() || null;
  const role = formData.get('role') as string | null;
  const isActiveRaw = formData.get('isActive');
  const isActive = isActiveRaw === undefined ? true : isActiveRaw !== 'false';
  const avatarFile = formData.get('avatarFile') as File | null;

  if (!email || !password || !name) {
    return { success: false, error: 'E-posta, şifre ve ad gerekli' };
  }

  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  if (existing) {
    return { success: false, error: 'Bu e-posta adresi zaten kayıtlı' };
  }

  const userId = generateRandomString(24, 'a-z', '0-9');
  const accountId = generateRandomString(24, 'a-z', '0-9');
  const hashedPassword = await hashPassword(password);

  let avatarMediaId: number | null = null;
  if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
    const uploadFormData = new FormData();
    uploadFormData.set('file', avatarFile);
    const uploadResult = await uploadMedia(uploadFormData);
    if (uploadResult.success) {
      avatarMediaId = uploadResult.media.id;
    }
  }

  await db.insert(user).values({
    id: userId,
    name,
    email,
    emailVerified: false,
    role: (role as 'ADMIN' | 'MANAGER' | 'USER' | 'GUEST') ?? 'USER',
    title,
    phone,
    isActive,
    companyId: u.companyId,
    avatarMediaId
  });

  await db.insert(account).values({
    id: accountId,
    userId,
    accountId: email,
    providerId: 'credential',
    password: hashedPassword
  });

  revalidatePath('/dashboard/users');
  return { success: true, id: userId };
}
