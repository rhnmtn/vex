import { delay } from '@/constants/mock-api';
import { OverviewStatsCards } from '@/features/overview/components/overview-stats-cards';

export default async function Stats() {
  await delay(800);
  return <OverviewStatsCards />;
}
