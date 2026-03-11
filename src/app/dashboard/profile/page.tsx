import PageContainer from '@/components/layout/page-container';

export default function ProfilePage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Profil</h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Hesap bilgilerinizi görüntüleyin ve düzenleyin
          </p>
        </div>
        <div className='text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm'>
          Profil bilgileri burada listelenecek.
        </div>
      </div>
    </PageContainer>
  );
}
