import { auth, getSessionUser, type SessionUserWithCompany } from '@/lib/auth';
import { headers } from 'next/headers';

export async function Footer() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = getSessionUser(session);
  const companyName = (user as SessionUserWithCompany)?.companyName ?? 'Vex';
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-border/40 shrink-0 border-t px-4 py-2 md:px-6'>
      <div className='flex flex-col items-center justify-between gap-1 text-center sm:flex-row sm:items-center sm:gap-2 sm:text-left'>
        <p className='text-muted-foreground/90 text-[11px]'>
          © {currentYear} {companyName}
        </p>
        <span className='text-muted-foreground/40 hidden sm:inline'>·</span>
        <p className='text-muted-foreground/60 text-[11px]'>
          VEX Tarafından Geliştirildi
        </p>
      </div>
    </footer>
  );
}
