'use client';

import type { WebCompany, WebMenuItem } from '@/lib/web-company';
import { DEFAULT_BRAND_NAME } from '@/constants/site';
import Link from 'next/link';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { IconMenu2 } from '@tabler/icons-react';
import { Logo } from '@/components/shared/logo';

const DEFAULT_HEADER_MENU: WebMenuItem[] = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hakkımızda', href: '/about' }
];

type PublicHeaderProps = {
  company?: WebCompany | null;
  menuItems?: WebMenuItem[];
  ctaHref?: string;
  ctaLabel?: string;
};

function MenuLink({
  item,
  className,
  onClick
}: {
  item: WebMenuItem;
  className?: string;
  onClick?: () => void;
}) {
  const isExternal = item.href.startsWith('http');
  const baseClass =
    'text-muted-foreground hover:text-foreground block select-none rounded-md p-2 text-sm font-medium leading-none outline-none transition-colors hover:bg-accent focus:bg-accent';

  if (isExternal) {
    return (
      <a
        href={item.href}
        target='_blank'
        rel='noopener noreferrer'
        className={cn(baseClass, className)}
        aria-label={`${item.label} (yeni sekmede açılır)`}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link
      href={item.href}
      className={cn(baseClass, className)}
      onClick={onClick}
    >
      {item.label}
    </Link>
  );
}

function MobileNavItems({
  items,
  onItemClick
}: {
  items: WebMenuItem[];
  onItemClick?: () => void;
}) {
  return (
    <nav className='flex flex-col gap-2' aria-label='Ana navigasyon'>
      {items.map((item, idx) =>
        item.children?.length ? (
          <div
            key={`${item.label}-${item.href}-${idx}`}
            className='flex flex-col gap-1'
          >
            <MenuLink item={item} onClick={onItemClick} />
            <div className='flex flex-col pl-4'>
              {item.children.map((child, cIdx) => (
                <MenuLink
                  key={`${child.label}-${child.href}-${cIdx}`}
                  item={child}
                  onClick={onItemClick}
                />
              ))}
            </div>
          </div>
        ) : (
          <MenuLink
            key={`${item.label}-${item.href}-${idx}`}
            item={item}
            onClick={onItemClick}
          />
        )
      )}
    </nav>
  );
}

export function PublicHeader({
  company = null,
  menuItems,
  ctaHref = '/auth/sign-in',
  ctaLabel = 'Giriş Yap'
}: PublicHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const brandName = company?.shortName ?? company?.name ?? DEFAULT_BRAND_NAME;
  const items = menuItems?.length ? menuItems : DEFAULT_HEADER_MENU;

  return (
    <header
      className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 overflow-x-hidden backdrop-blur'
      role='banner'
    >
      <div className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 overflow-hidden px-4 sm:px-6 lg:px-8'>
        <div className='flex min-w-0 items-center overflow-hidden'>
          {(company?.logoLight ?? company?.logoDark ?? company?.logo) ? (
            <Link
              href='/'
              className='block shrink-0'
              aria-label={`${brandName} ana sayfa`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  company.logoLight ?? company.logoDark ?? company.logo ?? ''
                }
                alt={brandName}
                className='h-9 max-h-9 w-auto max-w-[180px] object-contain object-left sm:max-w-[220px]'
              />
            </Link>
          ) : (
            <Logo
              href='/'
              className='h-9 w-auto max-w-[180px] shrink-0 sm:max-w-[220px]'
              variant='full'
            />
          )}
        </div>

        {/* Desktop nav */}
        <NavigationMenu className='hidden md:flex'>
          <NavigationMenuList className='gap-1' aria-label='Ana navigasyon'>
            {items.map((item, idx) => (
              <NavigationMenuItem key={`${item.label}-${item.href}-${idx}`}>
                {item.children?.length ? (
                  <>
                    <NavigationMenuTrigger
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'text-muted-foreground hover:text-foreground h-10 min-h-10 bg-transparent px-3 text-sm font-medium'
                      )}
                      aria-haspopup='true'
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className='grid w-[220px] gap-0.5 p-2'>
                        <li>
                          <NavigationMenuLink asChild>
                            <MenuLink item={item} />
                          </NavigationMenuLink>
                        </li>
                        {item.children.map((child, cIdx) => (
                          <li key={`${child.label}-${child.href}-${cIdx}`}>
                            <NavigationMenuLink asChild>
                              <MenuLink item={child} />
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'text-muted-foreground hover:text-foreground h-10 min-h-10 bg-transparent px-3 text-sm font-medium'
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA + Mobile menu */}
        <div className='flex shrink-0 items-center gap-2'>
          <Button
            asChild
            variant='default'
            size='sm'
            className='hidden sm:inline-flex'
          >
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden'
                aria-label='Menüyü aç'
                aria-expanded={mobileOpen}
              >
                <IconMenu2 className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[280px] sm:w-[320px]'>
              <SheetHeader>
                <SheetTitle className='sr-only'>Navigasyon menüsü</SheetTitle>
              </SheetHeader>
              <div className='mt-6 flex flex-col gap-6'>
                <MobileNavItems
                  items={items}
                  onItemClick={() => setMobileOpen(false)}
                />
                <Button asChild className='w-full'>
                  <Link href={ctaHref} onClick={() => setMobileOpen(false)}>
                    {ctaLabel}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
