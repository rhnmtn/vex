import { InteractiveGridPattern } from './interactive-grid';
import { cn } from '@/lib/utils';

export function AuthLayoutPanel() {
  return (
    <div className='relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex dark:border-r'>
      <div className='absolute inset-0 bg-zinc-900' />
      <div className='relative z-20 flex items-center text-lg font-medium'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2 h-6 w-6'
        >
          <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
        </svg>
        Vex
      </div>
      <InteractiveGridPattern
        className={cn(
          'mask-[radial-gradient(400px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[0%] h-full skew-y-12'
        )}
        squaresClassName='stroke-white/10'
      />
      <div className='relative z-20 mt-auto'>
        <blockquote className='space-y-2'>
          <p className='text-lg'>
            &ldquo;Bu dashboard şablonu sayesinde projelerimi daha hızlı teslim
            edebiliyor ve müşterilerime daha iyi hizmet sunabiliyorum.&rdquo;
          </p>
          <footer className='text-sm'>Kullanıcı</footer>
        </blockquote>
      </div>
    </div>
  );
}
