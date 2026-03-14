import { auth, getSessionUser, type SessionUserWithCompany } from '@/lib/auth';
import { headers } from 'next/headers';

export async function Footer() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = getSessionUser(session);
  const companyName = (user as SessionUserWithCompany)?.companyName ?? 'Vex';
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-border/60 shrink-0 border-t px-4 py-3 md:px-6'>
      <div className='flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left'>
        <p className='text-muted-foreground text-xs'>
          © {currentYear} {companyName}
        </p>
        <p className='text-muted-foreground/80 text-xs'>
          Premium tatil kiralama platformu
        </p>
      </div>
    </footer>
  );
}
