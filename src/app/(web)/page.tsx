import { BlogCard, Features, Hero } from '@/components/shared';
import {
  getPublicPages,
  type PublicPage
} from '@/features/pages/actions/get-public-page';
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

function PagesSection({ pages: pageList }: { pages: PublicPage[] }) {
  if (pageList.length === 0) return null;
  return (
    <section
      className='bg-background mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8'
      aria-labelledby='pages-heading'
    >
      <h2
        id='pages-heading'
        className='text-foreground mb-8 text-center text-2xl font-bold sm:text-3xl'
      >
        Sayfalar
      </h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {pageList.map((page) => (
          <a
            key={page.id}
            href={`/${page.slug}`}
            className='bg-card hover:border-primary/50 flex flex-col gap-2 rounded-xl border p-6 transition-colors'
          >
            <span className='text-foreground font-semibold'>{page.title}</span>
            {page.metaDescription && (
              <span className='text-muted-foreground line-clamp-2 text-sm'>
                {page.metaDescription}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
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
  const [blogData, company, publicPages] = await Promise.all([
    getPublicBlogData(),
    getWebCompany(),
    getPublicPages()
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
          ...(publicPages.length > 0
            ? [
                {
                  href: '#pages-heading',
                  label: 'Sayfalar',
                  variant: 'outline' as const
                }
              ]
            : []),
          { href: '/about', label: 'Hakkımızda', variant: 'outline' as const }
        ]}
      />

      <Features />

      {/* Sayfalar */}
      <PagesSection pages={publicPages} />

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
