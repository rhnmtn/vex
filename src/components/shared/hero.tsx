import { cn } from '@/lib/utils';
import Link from 'next/link';

type HeroProps = {
  /** Ana başlık */
  title: string;
  /** Alt başlık / açıklama */
  subtitle?: string;
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
 * KiralaKal kısa konaklama temasına uygun hero bileşeni.
 * Performans: Sadece HTML + CSS, client component yok, görsel yok.
 */
export function Hero({ title, subtitle, actions = [], className }: HeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden py-16 sm:py-20 lg:py-24',
        // KiralaKal: primary tonlarında hafif gradient arka plan
        'from-primary/[0.07] via-background to-background bg-linear-to-b',
        className
      )}
      aria-labelledby='hero-title'
    >
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

      <div className='relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
        <h1
          id='hero-title'
          className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'
        >
          {title}
        </h1>
        {subtitle && (
          <p className='text-muted-foreground mt-4 text-lg leading-relaxed sm:text-xl'>
            {subtitle}
          </p>
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
