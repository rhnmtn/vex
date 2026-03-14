import { formViewport } from '@/config/viewport';
import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth, getSessionUser, type SessionUserWithCompany } from '@/lib/auth';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const viewport = formViewport;

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth.api.getSession({ headers: await headers() });
  const u = getSessionUser(session);
  const companyName = (u as SessionUserWithCompany)?.companyName ?? 'Vex';
  return {
    title: `Dashboard - ${companyName}`,
    description: `${companyName} — Premium tatil kiralama platformu`,
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/auth/sign-in');
  }

  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return (
    <KBar>
      <div className='h-svh overflow-hidden'>
        <div className='flex h-[133.33%] min-h-[133.33vh] w-[133.33%] min-w-[133.33vw] origin-top-left scale-[0.75] md:h-full md:min-h-0 md:w-full md:min-w-0 md:scale-100'>
          <SidebarProvider defaultOpen={defaultOpen} className='h-full w-full'>
            <InfobarProvider defaultOpen={false}>
              <AppSidebar />
              <SidebarInset>
                <Header />
                {children}
              </SidebarInset>
              <InfoSidebar side='right' />
            </InfobarProvider>
          </SidebarProvider>
        </div>
      </div>
    </KBar>
  );
}
