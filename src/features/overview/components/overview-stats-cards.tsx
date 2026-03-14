import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

const STATS = [
  {
    description: 'Total Revenue',
    value: '$1,250.00',
    trend: 'up',
    trendLabel: 'Trending up this month',
    footer: 'Visitors for the last 6 months'
  },
  {
    description: 'New Customers',
    value: '1,234',
    trend: 'down',
    trendLabel: 'Down 20% this period',
    footer: 'Acquisition needs attention'
  },
  {
    description: 'Active Accounts',
    value: '45,678',
    trend: 'up',
    trendLabel: 'Strong user retention',
    footer: 'Engagement exceed targets'
  },
  {
    description: 'Growth Rate',
    value: '4.5%',
    trend: 'up',
    trendLabel: 'Steady performance increase',
    footer: 'Meets growth projections'
  }
] as const;

export function OverviewStatsCards() {
  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
      {STATS.map((stat) => (
        <Card key={stat.description} className='@container/card'>
          <CardHeader>
            <CardDescription>{stat.description}</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {stat.value}
            </CardTitle>
            <CardAction>
              <Badge variant='outline'>
                {stat.trend === 'up' ? (
                  <IconTrendingUp />
                ) : (
                  <IconTrendingDown />
                )}
                {stat.trend === 'up' ? '+12.5%' : '-20%'}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              {stat.trendLabel}{' '}
              {stat.trend === 'up' ? (
                <IconTrendingUp className='size-4' />
              ) : (
                <IconTrendingDown className='size-4' />
              )}
            </div>
            <div className='text-muted-foreground'>{stat.footer}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
