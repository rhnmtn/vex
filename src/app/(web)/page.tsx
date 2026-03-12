import { BlogCard, Hero } from '@/components/shared';
import { getPublicBlogData } from '@/features/posts/actions/get-public-blog';
import { BlogEmptyState } from '@/features/posts/components/blog-empty-state';
import type { PublicCategoryWithPosts } from '@/features/posts/actions/get-public-blog';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'KiralaKal — Kısa Konaklama',
  description:
    'KiralaKal ile kısa süreli tatil kiralama. Premium konaklama seçenekleri.'
};

function CategorySection({ category }: { category: PublicCategoryWithPosts }) {
  return (
    <section className='space-y-6'>
      <div className='flex items-center gap-3'>
        {category.bannerImagePath && (
          <div className='relative h-10 w-10 overflow-hidden rounded-lg'>
            <Image
              src={category.bannerImagePath}
              alt={category.name}
              fill
              className='object-cover'
            />
          </div>
        )}
        <h2 className='text-foreground text-xl font-semibold'>
          {category.name}
        </h2>
      </div>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {category.posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const { categories, totalPosts } = await getPublicBlogData();

  return (
    <>
      {/* Hero: tam genişlik, normal içerikten daha geniş */}
      <Hero
        title='Kısa Konaklama, Uzun Anılar'
        subtitle='KiralaKal ile tatil kiralama deneyiminizi keşfedin. Güncel yazılar ve konaklama ipuçları.'
        actions={[
          ...(totalPosts > 0
            ? [
                {
                  href: '#blog-heading',
                  label: 'Yazıları Keşfet',
                  variant: 'default' as const
                }
              ]
            : []),
          { href: '/about', label: 'Hakkımızda', variant: 'outline' as const }
        ]}
      />

      {/* Blog Content: max-w-7xl ile sınırlı */}
      <section
        className='mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8'
        aria-labelledby='blog-heading'
      >
        <h2 id='blog-heading' className='sr-only'>
          Blog Yazıları
        </h2>
        {totalPosts === 0 ? (
          <BlogEmptyState />
        ) : (
          <div className='space-y-16'>
            {categories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
