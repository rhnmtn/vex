import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'symbol';
  href?: string;
}

export function Logo({
  className = '',
  variant = 'full',
  href = '/'
}: LogoProps) {
  const LogoSvg = (
    <svg
      viewBox='0 0 600 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('transition-all duration-500', className)}
      aria-hidden
    >
      {/* KK Sembolü - Tema renkleri (0–72 birim) */}
      <g transform='translate(0, 15) scale(0.28)'>
        {/* Sol K - Vurgu rengi (chart-1: turuncu/amber) */}
        <path
          d='M60 40h40v160H60z M145 40h40l-50 90 50 70h-40l-50-70z'
          fill='var(--chart-1)'
          className='transition-colors duration-300'
        />

        {/* Sağ K - Metin rengi (foreground) */}
        <path
          d='M200 40h40l-50 90 50 70h-40l-50-70z'
          fill='var(--foreground)'
          className='transition-colors duration-300'
        />
      </g>

      {/* KiralaKal Yazısı - KK sembolünden sonra (grup x≈75) */}
      {variant === 'full' && (
        <g transform='translate(75, 0)'>
          <text
            x='0'
            y='55'
            textAnchor='start'
            dominantBaseline='middle'
            fill='var(--foreground)'
            className='transition-colors duration-300 select-none'
            style={{
              fontFamily: 'inherit',
              fontSize: '50px',
              letterSpacing: '0.05em'
            }}
          >
            <tspan style={{ fontWeight: 700 }}>KiralaKal</tspan>
            <tspan style={{ fontWeight: 300 }}>.com</tspan>
          </text>

          {/* Alt çizgi */}
          <path
            d='M0 70h300'
            stroke='var(--foreground)'
            strokeWidth='0.5'
            strokeLinecap='round'
            className='opacity-20 transition-opacity duration-300'
          />
        </g>
      )}
    </svg>
  );

  return href ? (
    <Link
      href={href}
      className='focus-visible:ring-ring rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
      aria-label='KiralaKal ana sayfa'
    >
      {LogoSvg}
    </Link>
  ) : (
    LogoSvg
  );
}
