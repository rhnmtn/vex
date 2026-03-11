'use client';

import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import {
  IconLayoutDashboard,
  IconLogout,
  IconSettings,
  IconUser
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SidebarMenuButton } from '@/components/ui/sidebar';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Yönetici',
  USER: 'Kullanıcı',
  GUEST: 'Misafir'
};

export function SidebarUser() {
  const { state } = useSidebar();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (!session?.user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' asChild tooltip='Giriş Yap'>
            <Link href='/auth/sign-in'>
              <div className='bg-muted flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg'>
                <IconUser className='text-muted-foreground size-4' />
              </div>
              <div
                className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${
                  state === 'collapsed'
                    ? 'invisible max-w-0 overflow-hidden opacity-0'
                    : 'visible max-w-full opacity-100'
                }`}
              >
                <span className='truncate font-medium'>Giriş Yap</span>
                <span className='text-muted-foreground truncate text-xs'>
                  Hesabınıza giriş yapın
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const initials = (session.user.name ?? '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const role =
    (session.user as { role?: string }).role ?? 'USER';
  const roleLabel = ROLE_LABELS[role] ?? role;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              tooltip={session.user.name ?? 'Hesap'}
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='size-8 shrink-0'>
                <AvatarImage src={session.user.image ?? undefined} alt="" />
                <AvatarFallback className='bg-primary/10 text-primary text-xs font-medium'>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div
                className={`grid min-w-0 flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${
                  state === 'collapsed'
                    ? 'invisible max-w-0 overflow-hidden opacity-0'
                    : 'visible max-w-full opacity-100'
                }`}
              >
                <span className='truncate font-medium'>
                  {session.user.name ?? 'Hesap'}
                </span>
                <span className='text-muted-foreground truncate text-xs'>
                  {session.user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-lg'
            side='top'
            align='end'
            sideOffset={4}
          >
            <div className='flex items-start gap-3 px-2 py-2'>
              <Avatar className='size-10 shrink-0'>
                <AvatarImage src={session.user.image ?? undefined} alt="" />
                <AvatarFallback className='bg-primary/10 text-primary text-sm font-medium'>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className='grid min-w-0 flex-1 gap-1'>
                <p className='truncate font-medium'>
                  {session.user.name ?? 'Hesap'}
                </p>
                <p className='text-muted-foreground truncate text-xs'>
                  {session.user.email}
                </p>
                <Badge variant='secondary' className='mt-1 w-fit text-xs'>
                  {roleLabel}
                </Badge>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Hızlı erişim
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push('/dashboard/overview')}
              className='cursor-pointer'
            >
              <IconLayoutDashboard className='mr-2 h-4 w-4' />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/dashboard/profile'>
                <IconUser className='mr-2 h-4 w-4' />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/dashboard/settings'>
                <IconSettings className='mr-2 h-4 w-4' />
                Ayarlar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut();
                toast.success('Çıkış yapıldı');
                router.push('/');
                router.refresh();
              }}
              className='cursor-pointer text-destructive focus:text-destructive'
            >
              <IconLogout className='mr-2 h-4 w-4' />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
