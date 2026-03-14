import {
  Card,
  CardAction,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function OverviewStatsCardsSkeleton() {
  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className='flex flex-col gap-1'>
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-8 w-[120px]' />
            </div>
            <CardAction>
              <Skeleton className='h-6 w-[70px] rounded-md' />
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5'>
            <Skeleton className='h-4 w-[140px]' />
            <Skeleton className='h-4 w-[180px]' />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
