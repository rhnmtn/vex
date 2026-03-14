import PageContainer from '@/components/layout/page-container';
import React from 'react';

export default function OverviewLayout({
  children,
  stats,
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  children: React.ReactNode;
  stats: React.ReactNode;
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex min-w-0 flex-1 flex-col space-y-2 overflow-x-hidden'>
        {children}
        {stats}
        <div className='grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4 min-w-0 overflow-x-auto overflow-y-visible'>
            {bar_stats}
          </div>
          <div className='col-span-4 min-w-0 md:col-span-3'>{sales}</div>
          <div className='col-span-4 min-w-0 overflow-hidden'>{area_stats}</div>
          <div className='col-span-4 min-w-0 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
