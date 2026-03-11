import Link from 'next/link';

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t bg-muted/30'>
      <div className='mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col gap-4'>
            <Link href='/' className='text-foreground font-semibold text-lg'>
              Vex
            </Link>
            <p className='text-muted-foreground max-w-md text-sm'>
              Production-ready admin dashboard starter built with Next.js,
              Tailwind CSS, and shadcn/ui.
            </p>
          </div>

          <div className='flex flex-wrap gap-6'>
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
            <Link
              href='/privacy-policy'
              className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms-of-service'
              className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <div className='border-border mt-8 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-sm'>
            © {currentYear} Vex. Built with Next.js, Tailwind CSS, and shadcn/ui.
          </p>
        </div>
      </div>
    </footer>
  );
}
