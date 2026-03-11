'use server';

import { auth } from '@/lib/auth';
import { signUpSchema } from '@/features/auth/schemas/sign-up';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { APIError } from 'better-auth/api';

export type SignUpFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};

const CALLBACK_URL = '/dashboard';

export async function signUpAction(
  _prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validatedFields = signUpSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
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
      const msg = err.message ?? err.data?.message ?? 'Kayıt oluşturulamadı';
      return { message: msg };
    }
    return {
      message: 'Kayıt oluşturulamadı. Lütfen tekrar deneyin.',
    };
  }
}
