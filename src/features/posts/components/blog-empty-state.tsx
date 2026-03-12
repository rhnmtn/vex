import { FileText } from 'lucide-react';

export function BlogEmptyState() {
  return (
    <div className='bg-muted/30 flex flex-col items-center justify-center rounded-2xl border border-dashed px-8 py-16 text-center'>
      <div className='bg-muted/50 rounded-full p-4'>
        <FileText
          className='text-muted-foreground h-12 w-12'
          strokeWidth={1.5}
        />
      </div>
      <h3 className='text-foreground mt-4 text-lg font-semibold'>
        Henüz yayınlanmış blog yazısı bulunmuyor
      </h3>
      <p className='text-muted-foreground mt-2 max-w-sm text-sm'>
        Blog yazıları yayınlandığında burada kategorilere göre listelenecektir.
      </p>
    </div>
  );
}
