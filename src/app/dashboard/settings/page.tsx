import PageContainer from '@/components/layout/page-container';

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Ayarlar</h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Şirket ve hesap ayarlarınızı yönetin
          </p>
        </div>
        <div className='text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm'>
          Şirket bilgileri ve ayarlar burada listelenecek.
        </div>
      </div>
    </PageContainer>
  );
}
