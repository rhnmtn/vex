import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ArrowRight, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export type BlogCardPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  featuredImagePath: string | null;
};

type BlogCardProps = {
  post: BlogCardPost;
  /** Varsayılan: false. true ise daha kompakt görünüm */
  compact?: boolean;
};

export function BlogCard({ post, compact = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group block transition-transform duration-300 ease-out outline-none',
        'focus-visible:ring-ring focus-visible:ring-offset-background rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2'
      )}
    >
      <Card
        className={cn(
          'border-border/80 bg-card overflow-hidden p-0 transition-all duration-300 ease-out',
          'hover:border-border hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20',
          'hover:-translate-y-0.5'
        )}
      >
        {/* Image */}
        <div className='bg-muted relative aspect-video w-full overflow-hidden'>
          {post.featuredImagePath ? (
            <>
              <Image
                src={post.featuredImagePath}
                alt={post.title}
                fill
                className='object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              />
              <div
                className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                aria-hidden
              />
            </>
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <FileText
                className='text-muted-foreground/50 h-12 w-12'
                strokeWidth={1.25}
                aria-hidden
              />
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent
          className={cn('flex flex-col', compact ? 'gap-2 p-4' : 'gap-3 p-5')}
        >
          <h3 className='text-foreground group-hover:text-primary line-clamp-2 leading-tight font-semibold transition-colors'>
            {post.title}
          </h3>
          {post.excerpt && (
            <p className='text-muted-foreground line-clamp-2 text-sm leading-relaxed'>
              {post.excerpt}
            </p>
          )}
          <div className='mt-auto flex items-center justify-between gap-3 pt-1'>
            {post.publishedAt ? (
              <time
                dateTime={post.publishedAt.toISOString()}
                className='text-muted-foreground shrink-0 text-xs'
              >
                {format(post.publishedAt, 'd MMM yyyy', { locale: tr })}
              </time>
            ) : (
              <span />
            )}
            <span className='text-primary ml-auto inline-flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100'>
              Devamını oku
              <ArrowRight className='h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5' />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
