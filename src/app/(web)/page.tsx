import { BlogCard, FeaturesSection, Hero } from '@/components/shared';
import { getPublicBlogData } from '@/features/posts/actions/get-public-blog';
import { BlogEmptyState } from '@/features/posts/components/blog-empty-state';
import type { PublicCategoryWithPosts } from '@/features/posts/actions/get-public-blog';
import { getWebCompany } from '@/lib/web-company';
import type { Metadata } from 'next';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  const company = await getWebCompany();
  const brandName = company?.shortName ?? company?.name ?? 'KiralaKal';

  return {
    title: `${brandName} — Kısa Konaklama`,
    description:
      company?.description ??
      'Kısa süreli tatil kiralama. Premium konaklama seçenekleri.'
  };
}

function CategorySection({ category }: { category: PublicCategoryWithPosts }) {
  return (
    <section className='space-y-8'>
      <div className='flex items-center gap-4'>
        {category.bannerImagePath && (
          <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-xl'>
            <Image
              src={category.bannerImagePath}
              alt={category.name}
              fill
              className='object-cover'
            />
          </div>
        )}
        <h2 className='text-foreground text-xl font-semibold sm:text-2xl'>
          {category.name}
        </h2>
      </div>
      <div className='grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {category.posts.map((post) => (
          <div key={post.id} className='h-full'>
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [blogData, company] = await Promise.all([
    getPublicBlogData(),
    getWebCompany()
  ]);
  const { categories, totalPosts } = blogData;

  return (
    <>
      {/* Hero: tam genişlik, normal içerikten daha geniş */}
      <Hero
        company={company}
        title='KiralaKal'
        subtitle='Hayalinizdeki villa tatiline güvenle ulaşın'
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

      <FeaturesSection />

      {/* Blog Content */}
      <section
        className='bg-background mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8'
        aria-labelledby='blog-heading'
      >
        <h2 id='blog-heading' className='sr-only'>
          Blog Yazıları
        </h2>
        {totalPosts === 0 ? (
          <BlogEmptyState />
        ) : (
          <div className='space-y-16'>
            <h2 className='text-foreground text-center text-2xl font-bold sm:text-3xl'>
              Yazılar
            </h2>
            {categories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
