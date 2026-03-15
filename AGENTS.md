# AGENTS.md - AI Coding Agent Reference

Bu dosya, projede çalışan AI coding agent'lar için temel bilgileri içerir. Proje kuralları `.cursor/rules/` altındaki MDC dosyalarında tanımlıdır; bu dosya genel bakış ve referans sağlar.

---

## Project Overview

**Vexto / KiralaKal** — Premium tatil kiralama platformu. Next.js 16, çok kiracılı (multi-tenant) ERP/dashboard. Şirket bazlı veri izolasyonu; her kayıt bir şirkete bağlı.

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Authentication**: Better Auth (e-posta/şifre, custom session)
- **Database**: PostgreSQL + Drizzle ORM
- **Package Manager**: pnpm

---

## Technology Stack

| Alan | Teknoloji |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| Auth | Better Auth (e-posta/şifre, custom session) |
| DB | PostgreSQL + Drizzle ORM |
| UI | Shadcn UI, Tailwind CSS v4 |
| Form | React Hook Form + Zod |
| URL state | Nuqs |
| Tablo | TanStack Table + Data Table |
| Medya | Cloudinary |
| Editör | Lexical (blog) |

## Temel Konvansiyonlar
- **Server components:** Varsayılan; `'use client'` yalnızca gerekirse
- **Dil:** UI metinleri, hata mesajları, placeholder'lar Türkçe
- **Path alias:** `@/` → `src/`

---

## Project Structure

```
/src
├── app/                    # Next.js App Router
│   ├── (web)/             # Public site (landing, blog, about, privacy, terms)
│   ├── api/auth/          # Better Auth API route
│   ├── auth/              # Sign-in, sign-up
│   ├── dashboard/         # Dashboard routes
│   │   ├── company/       # Şirket bilgileri
│   │   ├── customers/     # Müşteri yönetimi
│   │   ├── menu/          # Menü bilgileri (header/footer)
│   │   ├── overview/     # Dashboard özet (parallel routes)
│   │   ├── post-categories/  # Blog kategorileri
│   │   ├── posts/         # Bloglar
│   │   ├── profile/      # Profil
│   │   ├── settings/     # Ayarlar
│   │   └── users/        # Kullanıcı yönetimi
│   ├── layout.tsx
│   ├── page.tsx
│   ├── global-error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Sidebar, header, footer, page-container
│   ├── forms/             # Form field wrappers
│   ├── themes/            # Theme system
│   ├── kbar/              # Command+K search
│   └── icons.tsx
│
├── features/              # Feature-based modules
│   ├── auth/              # Authentication (sign-in, sign-up)
│   ├── company/           # Şirket bilgileri, menü
│   ├── customers/         # Müşteri CRUD
│   ├── editor/            # Lexical editor (blog)
│   ├── media/             # Medya yönetimi
│   ├── overview/          # Dashboard istatistikleri
│   ├── post-categories/   # Blog kategorileri
│   ├── posts/             # Blog yazıları
│   ├── profile/           # Profil, şifre
│   └── users/             # Kullanıcı yönetimi
│
├── config/                # nav-config, viewport, infoconfig
├── lib/                   # auth, auth-client, utils, cloudinary
├── db/                    # Drizzle schema, migrations
├── types/                 # NavItem, vb.
└── styles/                # globals.css, theme.css, themes/
```

---

## Dashboard Navigation

Sidebar nav: Dashboard, Kullanıcılar, Müşteriler, Blog (alt: Blog Kategorileri, Bloglar).

**Org-switcher (şirket dropdown):** Şirket Bilgileri, Menü Bilgileri — `/dashboard/company`, `/dashboard/menu`

---

## Authentication (Better Auth)

### Route Protection
```tsx
// src/app/dashboard/layout.tsx
const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect('/auth/sign-in');
```

### Auth Layout (giriş yapmış kullanıcıyı yönlendir)
```tsx
// src/app/auth/layout.tsx
if (session) redirect('/dashboard');
```

### Session & Company
```tsx
import { auth, getSessionUser, type SessionUserWithCompany } from '@/lib/auth';

const session = await auth.api.getSession({ headers: await headers() });
const user = getSessionUser(session);
const companyId = (user as SessionUserWithCompany)?.companyId ?? null;
```

### Server Actions
```tsx
'use server';
import { auth, type SessionUserWithCompany } from '@/lib/auth';

const session = await auth.api.getSession({ headers: await headers() });
const companyId = (session?.user as SessionUserWithCompany)?.companyId;
if (companyId == null) return null; // veya { success: false, error: '...' }
```

---

## Build & Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm format
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

---

## Environment (Better Auth)

```env
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000  # veya production URL
DATABASE_URL=postgresql://...
```

---

## Code Style

- **TypeScript:** Strict mode, explicit return types
- **Prettier:** singleQuote, semi, trailingComma: none
- **Components:** `cn()` for className merging
- **Server components by default** — `'use client'` only when needed

---

## Notes for AI Agents

1. **Always use `cn()`** for className merging
2. **Respect feature-based structure** — new code in `src/features/[domain]/`
3. **Server components by default** — `'use client'` only when needed
4. **Type safety first** — avoid `any`
5. **Turkish UI** — labels, messages, placeholders
6. **Auth:** `auth.api.getSession` + `companyId` from session (tek-şirket modeli)
7. **shadcn components** — extend, don't modify `src/components/ui/` directly
