import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'symbol';
  href?: string;
}

/** KK sembolü - flex ile metinle hizalı */
const LogoSymbol = ({ className }: { className?: string }) => (
  <svg
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={cn('shrink-0', className)}
    aria-hidden
  >
    <g transform='translate(0, 1.78) scale(0.17778) translate(-60, -40)'>
      <path
        d='M60 40h40v160H60z M145 40h40l-50 90 50 70h-40l-50-70z'
        fill='var(--chart-1)'
      />
      <path d='M200 40h40l-50 90 50 70h-40l-50-70z' fill='var(--foreground)' />
    </g>
  </svg>
);

export function Logo({
  className = '',
  variant = 'full',
  href = '/'
}: LogoProps) {
  const content = (
    <>
      <LogoSymbol className='h-5 w-5 sm:h-6 sm:w-6' />
      {variant === 'full' && (
        <span className='text-foreground text-sm leading-none font-normal tracking-wide whitespace-nowrap select-none sm:text-base'>
          <span className='font-bold'>KiralaKal</span>
          <span className='font-light'>.com</span>
        </span>
      )}
    </>
  );

  const wrapperClass = cn(
    'inline-flex items-center justify-center gap-1.5',
    variant === 'full' && 'gap-2'
  );

  return href ? (
    <Link
      href={href}
      className={cn(
        'focus-visible:ring-ring inline-flex items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        wrapperClass,
        className
      )}
      aria-label='KiralaKal ana sayfa'
    >
      {content}
    </Link>
  ) : (
    <span className={cn(wrapperClass, className)}>{content}</span>
  );
}
