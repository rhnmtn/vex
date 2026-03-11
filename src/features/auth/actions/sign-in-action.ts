'use server';

import { auth } from '@/lib/auth';
import { signInSchema } from '@/features/auth/schemas/sign-in';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { APIError } from 'better-auth/api';

export type SignInFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

const CALLBACK_URL = '/dashboard';

export async function signInAction(
  _prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validatedFields = signInSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: CALLBACK_URL,
      },
      headers: await headers(),
    });

    redirect(CALLBACK_URL);
  } catch (error) {
    if (error instanceof APIError) {
      const err = error as { message?: string; data?: { message?: string } };
      const msg = err.message ?? err.data?.message ?? 'Giriş yapılamadı';
      return { message: msg };
    }
    return {
      message: 'Giriş yapılamadı. Lütfen tekrar deneyin.',
    };
  }
}
