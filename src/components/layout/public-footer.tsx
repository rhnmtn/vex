import type { WebCompany } from '@/lib/web-company';
import Link from 'next/link';

type PublicFooterProps = {
  company?: WebCompany | null;
};

export function PublicFooter({ company = null }: PublicFooterProps) {
  const currentYear = new Date().getFullYear();
  const brandName = company?.shortName ?? company?.name ?? 'Vex';
  const description =
    company?.description ??
    'Production-ready admin dashboard starter built with Next.js, Tailwind CSS, and shadcn/ui.';

  return (
    <footer className='bg-muted/30 border-t'>
      <div className='mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col gap-4'>
            <Link href='/' className='text-foreground text-lg font-semibold'>
              {brandName}
            </Link>
            <p className='text-muted-foreground max-w-md text-sm'>
              {description}
            </p>
          </div>

          <div className='flex flex-wrap gap-6'>
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
            <Link
              href='/privacy-policy'
              className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
            >
              Gizlilik Politikası
            </Link>
            <Link
              href='/terms-of-service'
              className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
            >
              Kullanım Koşulları
            </Link>
          </div>
        </div>

        <div className='border-border mt-8 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-sm'>
            © {currentYear} {brandName}
          </p>
        </div>
      </div>
    </footer>
  );
}
