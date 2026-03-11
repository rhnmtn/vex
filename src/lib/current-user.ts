import { auth } from '@/lib/auth';

/**
 * Oturumdaki auth user id (text). Companies/customers createdByAuthId, updatedByAuthId için kullanılır.
 * Server component veya server action'dan headers ile çağırın.
 */
export async function getCurrentAuthUserId(
  headers: Headers
): Promise<string | null> {
  const session = await auth.api.getSession({ headers });
  return session?.user?.id ?? null;
}
