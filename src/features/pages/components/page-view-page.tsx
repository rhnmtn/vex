import { getPageById } from '@/features/pages/actions/get-page-by-id';
import { notFound } from 'next/navigation';
import PageForm from './page-form';

type PageViewPageProps = {
  pageId: string;
};

export default async function PageViewPage({ pageId }: PageViewPageProps) {
  if (pageId === 'new') {
    return <PageForm initialData={null} pageTitle='Yeni Sayfa' />;
  }

  const id = parseInt(pageId, 10);
  if (Number.isNaN(id)) {
    notFound();
  }

  const page = await getPageById(id);
  if (!page) {
    notFound();
  }

  return (
    <PageForm
      initialData={{
        id: page.id,
        title: page.title,
        slug: page.slug,
        content: page.content,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        isActive: page.isActive,
        featuredImageId: page.featuredImageId,
        featuredImagePath: page.featuredImagePath
      }}
      pageTitle='Sayfa Düzenle'
    />
  );
}
