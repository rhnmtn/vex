import { ThemeModeToggle } from '@/components/themes/theme-mode-toggle';
import { ThemeSelector } from '@/components/themes/theme-selector';
import Link from 'next/link';

export function PublicHeader() {
  return (
    <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
      <div className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link href='/' className='text-foreground font-semibold text-lg'>
          Vex
        </Link>

        <nav className='flex items-center gap-6'>
          <Link
            href='/'
            className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
          >
            Home
          </Link>
          <Link
            href='/about'
            className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
          >
            About
          </Link>
          <Link
            href='/dashboard/overview'
            className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
          >
            Dashboard
          </Link>
        </nav>

        <div className='flex items-center gap-2'>
          <ThemeModeToggle />
          <ThemeSelector />
        </div>
      </div>
    </header>
  );
}
