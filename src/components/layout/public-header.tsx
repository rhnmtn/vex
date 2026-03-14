import type { WebCompany, WebMenuItem } from '@/lib/web-company';
import Link from 'next/link';

const DEFAULT_HEADER_MENU: WebMenuItem[] = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hakkımızda', href: '/about' }
];

type PublicHeaderProps = {
  company?: WebCompany | null;
  menuItems?: WebMenuItem[];
};

export function PublicHeader({ company = null, menuItems }: PublicHeaderProps) {
  const brandName = company?.shortName ?? company?.name ?? 'Vex';
  const items = menuItems?.length ? menuItems : DEFAULT_HEADER_MENU;

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link href='/' className='text-foreground text-lg font-semibold'>
          {brandName}
        </Link>

        <nav className='flex items-center gap-6' aria-label='Ana navigasyon'>
          {items.map((item) =>
            item.href.startsWith('http') ? (
              <a
                key={item.href + item.label}
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href + item.label}
                href={item.href}
                className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
