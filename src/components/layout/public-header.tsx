import Link from 'next/link';

export function PublicHeader() {
  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link href='/' className='text-foreground text-lg font-semibold'>
          Vex
        </Link>

        <nav className='flex items-center gap-6'>
          <Link
            href='/'
            className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
          >
            Ana Sayfa
          </Link>
          <Link
            href='/about'
            className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
          >
            Hakkımızda
          </Link>
        </nav>
      </div>
    </header>
  );
}
