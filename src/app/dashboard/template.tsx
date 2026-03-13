/**
 * Next.js template — route değişiminde remount olur.
 * Layout'tan farklı olarak her navigasyonda yeni instance oluşur,
 * scroll konumu doğal olarak sıfırlanır.
 */
export default function DashboardTemplate({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className='flex min-h-0 flex-1 flex-col'>{children}</div>;
}
