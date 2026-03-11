'use client';

import { authClient } from '@/lib/auth-client';

const CALLBACK_URL = '/dashboard';

export type AuthResult = {
  success: boolean;
  error?: string;
};

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const { error } = await authClient.signIn.email(
    { email, password, callbackURL: CALLBACK_URL },
    {
      onError: () => {},
    }
  );

  if (error) {
    return { success: false, error: error.message ?? 'Giriş yapılamadı' };
  }

  return { success: true };
}
