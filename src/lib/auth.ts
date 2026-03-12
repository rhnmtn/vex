import { betterAuth } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin, customSession } from 'better-auth/plugins';
import { eq, leftJoin } from 'drizzle-orm';
import { db } from '@/db';
import { companies, user } from '@/db/drizzle-schema';

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

/** Tüm rollerde kullanıcının yetkili olduğu şirket id listesi. companyId varsa [companyId], yoksa []. */
export type AllowedCompanyIds = number[];

/** customSession ile genişletilmiş user tipi (companyId, role, companyName vb.) */
export type SessionUserWithCompany = {
  id: string;
  companyId: number | null;
  companyName?: string | null;
  role?: string;
  isActive?: boolean;
  [key: string]: unknown;
};

/** session.user'ı SessionUserWithCompany olarak döndürür */
export function getSessionUser(
  session: { user: unknown } | null
): SessionUserWithCompany | null {
  return session?.user as SessionUserWithCompany | null;
}

export const auth = betterAuth({
  baseURL,
  database: drizzleAdapter(db, {
    provider: 'pg'
  }),
  emailAndPassword: {
    enabled: true
  },
  trustedOrigins: [baseURL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  plugins: [
    nextCookies(),
    admin({
      adminRoles: ['ADMIN']
    }),
    customSession(async ({ user: authUser, session }) => {
      if (!session?.userId) return { user: authUser, session };
      const [row] = await db
        .select({
          role: user.role,
          isActive: user.isActive,
          companyId: user.companyId,
          companyShortName: companies.shortName,
          companyName: companies.name
        })
        .from(user)
        .leftJoin(companies, eq(user.companyId, companies.id))
        .where(eq(user.id, session.userId))
        .limit(1);
      const role =
        (row?.role as 'ADMIN' | 'MANAGER' | 'USER' | 'GUEST') ?? 'USER';
      const isActive = row?.isActive ?? true;
      const allowedCompanyIds: AllowedCompanyIds =
        row?.companyId != null ? [row.companyId] : [];
      const companyName = row?.companyShortName ?? row?.companyName ?? null;
      return {
        user: {
          ...authUser,
          role,
          isActive,
          companyId: row?.companyId ?? null,
          companyName
        },
        session,
        allowedCompanyIds,
        companyId: row?.companyId ?? null
      };
    })
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const path = String(ctx.path ?? '').replace(/^\/+/, '');
      if (path !== 'sign-in/email') return;
      const email =
        typeof ctx.body?.email === 'string'
          ? ctx.body.email.trim().toLowerCase()
          : undefined;
      if (!email) return;
      const [row] = await db
        .select({
          id: user.id,
          isActive: user.isActive,
          role: user.role,
          companyId: user.companyId
        })
        .from(user)
        .where(eq(user.email, email))
        .limit(1);
      if (row?.isActive === false) {
        throw new APIError('FORBIDDEN', {
          message:
            'Hesabınız pasif. Giriş yapmak için yönetici ile iletişime geçin.'
        });
      }
      // Tüm kullanıcıların şirket atanmış olmalı (tek şirket modu)
      if (row && row.isActive && row.companyId == null) {
        throw new APIError('FORBIDDEN', {
          message:
            'Hesabınıza henüz şirket atanmamış. Giriş yapmak için yönetici ile iletişime geçin.'
        });
      }
    })
  }
});
