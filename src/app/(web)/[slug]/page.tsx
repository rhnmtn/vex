import { LexicalEditor } from '@/features/editor';
import { getPublicPageBySlug } from '@/features/pages/actions/get-public-page';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPageBySlug(slug);
  if (!page) return { title: 'Sayfa Bulunamadı' };
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? undefined
  };
}

export default async function PublicPagePage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPublicPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <article className='mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8'>
      <Link
        href='/'
        className='text-muted-foreground hover:text-foreground mb-8 inline-block text-sm font-medium transition-colors'
      >
        ← Ana Sayfa
      </Link>

      <header className='mb-10'>
        <h1 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
          {page.title}
        </h1>
      </header>

      {page.featuredImagePath && (
        <div className='bg-muted relative mb-10 aspect-video w-full overflow-hidden rounded-xl'>
          <Image
            src={page.featuredImagePath}
            alt={page.title}
            fill
            className='object-cover'
            priority
            sizes='(max-width: 768px) 100vw, 768px'
          />
        </div>
      )}

      {page.content ? (
        <div className='prose prose-neutral dark:prose-invert max-w-none'>
          <LexicalEditor
            initialContent={page.content}
            editable={false}
            showToolbar={false}
            className='min-h-0 border-0 bg-transparent p-0 shadow-none'
          />
        </div>
      ) : (
        <p className='text-muted-foreground text-lg leading-relaxed'>
          Bu sayfada henüz içerik bulunmuyor.
        </p>
      )}
    </article>
  );
}
