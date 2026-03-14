import { cn } from '@/lib/utils';
import type { WebCompany } from '@/lib/web-company';
import Image from 'next/image';
import Link from 'next/link';

type HeroCompanyData = Pick<
  WebCompany,
  'heroText' | 'heroSubtitle' | 'heroImage' | 'shortName' | 'name'
>;

type HeroProps = {
  /** Şirket hero bilgileri - sağlanırsa heroText, heroSubtitle, heroImage buradan alınır */
  company?: HeroCompanyData | null;
  /** Ana başlık (company yoksa veya heroText boşsa kullanılır) */
  title?: string;
  /** Alt başlık (company yoksa veya heroSubtitle boşsa kullanılır) */
  subtitle?: string;
  /** Hero arka plan görseli (company yoksa veya heroImage boşsa kullanılır) */
  image?: string | null;
  /** CTA butonları - href ve label */
  actions?: Array<{
    href: string;
    label: string;
    variant?: 'default' | 'outline';
  }>;
  /** Ek sınıflar */
  className?: string;
};

/**
 * Şirket hero bilgilerine göre veya manuel props ile çalışan hero bileşeni.
 * company sağlanırsa heroText, heroSubtitle, heroImage öncelikli kullanılır.
 */
export function Hero({
  company,
  title,
  subtitle,
  image,
  actions = [],
  className
}: HeroProps) {
  const resolvedTitle = company?.heroText?.trim() || title?.trim() || '';
  const resolvedSubtitle =
    company?.heroSubtitle?.trim() || subtitle?.trim() || '';
  const resolvedImage = company?.heroImage ?? image ?? null;
  const showText = !!resolvedTitle && !!resolvedSubtitle;
  return (
    <section
      id='hero'
      className={cn(
        'relative overflow-hidden py-20 sm:py-24 lg:py-32',
        'from-primary/[0.07] via-background to-background bg-linear-to-b',
        'scroll-mt-16',
        className
      )}
      aria-labelledby={showText ? 'hero-title' : undefined}
    >
      {resolvedImage && (
        <div
          className='pointer-events-none absolute inset-0'
          data-main-image
        >
          <Image
            src={resolvedImage}
            alt={resolvedTitle || 'Sitenin ana görseli'}
            fill
            className='object-cover'
            sizes='100vw'
            priority
            fetchPriority='high'
            data-main-image
          />
          <div
            className='absolute inset-0 bg-background/20'
            aria-hidden
          />
        </div>
      )}
      {/* Dekoratif gradient blob - pure CSS, no assets */}
      <div
        className='pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-30 blur-3xl'
        style={{ background: 'var(--primary)' }}
        aria-hidden
      />
      <div
        className='pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full opacity-20 blur-2xl'
        style={{ background: 'var(--primary)' }}
        aria-hidden
      />

      <div className='relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
        {showText && (
          <>
            <h1
              id='hero-title'
              className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'
            >
              {resolvedTitle}
            </h1>
            <p className='text-muted-foreground mt-4 text-lg leading-relaxed sm:text-xl'>
              {resolvedSubtitle}
            </p>
          </>
        )}
        {actions.length > 0 && (
          <div className='mt-8 flex flex-wrap justify-center gap-4'>
            {actions.map(({ href, label, variant = 'default' }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  variant === 'default'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                    : 'border-input bg-background hover:bg-accent hover:text-accent-foreground border'
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
