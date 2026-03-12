import { LexicalEditor } from '@/features/editor';
import { getPublicPostBySlug } from '@/features/posts/actions/get-public-blog';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) return { title: 'Yazı Bulunamadı' };
  return {
    title: post.title,
    description: post.excerpt ?? undefined
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className='mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8'>
      <Link
        href='/'
        className='text-muted-foreground hover:text-foreground mb-8 inline-block text-sm font-medium transition-colors'
      >
        ← Blog
      </Link>

      <header className='mb-10'>
        <h1 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
          {post.title}
        </h1>
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt.toISOString()}
            className='text-muted-foreground mt-2 block text-sm'
          >
            {format(post.publishedAt, 'd MMMM yyyy', { locale: tr })}
          </time>
        )}
      </header>

      {post.featuredImagePath && (
        <div className='bg-muted relative mb-10 aspect-video w-full overflow-hidden rounded-xl'>
          <Image
            src={post.featuredImagePath}
            alt={post.title}
            fill
            className='object-cover'
            priority
            sizes='(max-width: 768px) 100vw, 768px'
          />
        </div>
      )}

      {post.content ? (
        <div className='prose prose-neutral dark:prose-invert max-w-none'>
          <LexicalEditor
            initialContent={post.content}
            editable={false}
            showToolbar={false}
            className='min-h-0 border-0 bg-transparent p-0 shadow-none'
          />
        </div>
      ) : (
        post.excerpt && (
          <p className='text-muted-foreground text-lg leading-relaxed'>
            {post.excerpt}
          </p>
        )
      )}
    </article>
  );
}
