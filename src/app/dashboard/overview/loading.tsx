import { Skeleton } from '@/components/ui/skeleton';

export default function OverviewLoading() {
  return (
    <div className='flex min-w-0 flex-1 flex-col space-y-2 overflow-x-hidden'>
      <div className='flex shrink-0 items-center justify-between py-2'>
        <Skeleton className='h-8 w-48' />
      </div>
    </div>
  );
}
