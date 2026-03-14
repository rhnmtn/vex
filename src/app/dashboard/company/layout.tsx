'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const companySubNav = [
  { title: 'Şirket Bilgileri', href: '/dashboard/company' },
  { title: 'Menü Bilgileri', href: '/dashboard/company/menu' }
];

export default function CompanyLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className='flex flex-1 flex-col'>
      <nav className='bg-muted mb-4 flex gap-1 rounded-lg p-1'>
        {companySubNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
