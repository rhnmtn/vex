import { getOptimizedImageUrl } from '@/lib/cloudinary';
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
  const rawImage = company?.heroImage ?? image ?? null;
  const resolvedImage = rawImage
    ? getOptimizedImageUrl(rawImage, { width: 2560, quality: 'auto:best' })
    : null;
  const showText = !!resolvedTitle || !!resolvedSubtitle;
  return (
    <section
      id='hero'
      className={cn(
        'bg-background relative flex min-h-[60vh] scroll-mt-16 flex-col justify-center overflow-hidden',
        className
      )}
      aria-labelledby={showText ? 'hero-title' : undefined}
    >
      {resolvedImage && (
        <div className='pointer-events-none absolute inset-0' data-main-image>
          <Image
            src={resolvedImage}
            alt={resolvedTitle || 'Sitenin ana görseli'}
            fill
            className='object-cover object-center'
            sizes='100vw'
            priority
            fetchPriority='high'
            quality={100}
            unoptimized={resolvedImage.includes('cloudinary.com')}
            placeholder='blur'
            blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAQA'
            data-main-image
          />
          <div
            className='from-background via-background/60 absolute inset-0 bg-linear-to-t to-transparent'
            aria-hidden
          />
        </div>
      )}

      <div className='relative z-10 mx-auto w-full max-w-4xl px-6 py-16 text-center sm:px-8 lg:px-10 lg:py-20'>
        {showText && (
          <>
            {resolvedTitle && (
              <h1
                id='hero-title'
                className='text-foreground text-3xl font-bold tracking-tight drop-shadow-md sm:text-4xl lg:text-5xl'
              >
                {resolvedTitle}
              </h1>
            )}
            {resolvedSubtitle && (
              <p
                className={cn(
                  'text-foreground/95 text-lg leading-relaxed drop-shadow-sm sm:text-xl',
                  resolvedTitle && 'mt-4'
                )}
              >
                {resolvedSubtitle}
              </p>
            )}
          </>
        )}
        {actions.length > 0 && (
          <div className='mt-8 flex flex-wrap justify-center gap-3'>
            {actions.map(({ href, label, variant = 'default' }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  variant === 'default'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-background/90 text-foreground hover:bg-background border-border border backdrop-blur-sm'
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
