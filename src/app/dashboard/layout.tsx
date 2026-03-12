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
    title: 'Dashboard',
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
        <SidebarProvider defaultOpen={defaultOpen} className='h-full'>
          <InfobarProvider defaultOpen={false}>
            <AppSidebar />
            <SidebarInset>
              <Header />
              {/* page main content */}
              {children}
              {/* page main content ends */}
            </SidebarInset>
            <InfoSidebar side='right' />
          </InfobarProvider>
        </SidebarProvider>
      </div>
    </KBar>
  );
}
