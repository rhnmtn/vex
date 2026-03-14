import type { WebCompany, WebMenuItem } from '@/lib/web-company';
import Link from 'next/link';
import Image from 'next/image';

const DEFAULT_FOOTER_MENU: WebMenuItem[] = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/about', label: 'Hakkımızda' },
  { href: '/privacy-policy', label: 'Gizlilik Politikası' },
  { href: '/terms-of-service', label: 'Kullanım Koşulları' }
];

type PublicFooterProps = {
  company?: WebCompany | null;
  menuItems?: WebMenuItem[];
};

export function PublicFooter({ company = null, menuItems }: PublicFooterProps) {
  const items = menuItems?.length ? menuItems : DEFAULT_FOOTER_MENU;
  const currentYear = new Date().getFullYear();
  const brandName = company?.shortName ?? company?.name ?? 'KiralaKal';
  const description =
    company?.description ??
    'Kısa süreli tatil kiralama. Premium konaklama seçenekleri.';
  const logoPath =
    company?.logoDark ?? company?.logo ?? company?.logoLight;
  const logoAlt = company?.logoAlt ?? brandName;

  return (
    <footer className='bg-muted/30 border-t' role='contentinfo'>
      <div className='mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4'>
          {/* Marka */}
          <div className='flex flex-col gap-4 lg:col-span-2'>
            <Link href='/' className='flex items-center gap-3'>
              {logoPath ? (
                <div className='relative h-10 w-24'>
                  <Image
                    src={logoPath}
                    alt={logoAlt}
                    fill
                    className='object-contain object-left'
                    sizes='96px'
                  />
                </div>
              ) : (
                <span className='text-foreground text-lg font-semibold'>
                  {brandName}
                </span>
              )}
            </Link>
            <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
              {description}
            </p>
          </div>

          {/* Navigasyon */}
          <div>
            <h3 className='text-foreground mb-4 text-sm font-semibold'>
              Sayfalar
            </h3>
            <nav
              className='flex flex-col gap-3'
              aria-label='Footer navigasyonu'
            >
              {items.map((item) =>
                item.href.startsWith('http') ? (
                  <a
                    key={item.href + item.label}
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* İletişim */}
          <div>
            <h3 className='text-foreground mb-4 text-sm font-semibold'>
              İletişim
            </h3>
            <div className='flex flex-col gap-3 text-sm'>
              {company?.email && (
                <a
                  href={`mailto:${company.email}`}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  {company.email}
                </a>
              )}
              {company?.phone && (
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  {company.phone}
                </a>
              )}
              {company?.website && (
                <a
                  href={company.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {!company?.email && !company?.phone && !company?.website && (
                <span className='text-muted-foreground'>
                  İletişim bilgisi yok
                </span>
              )}
            </div>
          </div>
        </div>

        <div className='border-border mt-10 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-sm'>
            © {currentYear} {brandName}. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
