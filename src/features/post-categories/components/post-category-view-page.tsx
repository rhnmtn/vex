import { getPostCategoryById } from '@/features/post-categories/actions/get-post-category-by-id';
import { notFound } from 'next/navigation';
import PostCategoryForm from './post-category-form';

type PostCategoryViewPageProps = {
  postCategoryId: string;
};

export default async function PostCategoryViewPage({
  postCategoryId
}: PostCategoryViewPageProps) {
  if (postCategoryId === 'new') {
    return (
      <PostCategoryForm
        initialData={null}
        pageTitle='Yeni Kategori'
      />
    );
  }

  const id = parseInt(postCategoryId, 10);
  if (Number.isNaN(id)) {
    notFound();
  }

  const category = await getPostCategoryById(id);
  if (!category) {
    notFound();
  }

  let bannerImagePath: string | null = null;
  if (category.bannerImageId) {
    const { getMediaById } = await import('@/features/media/actions/media');
    const media = await getMediaById(category.bannerImageId);
    bannerImagePath = media?.path ?? null;
  }

  return (
    <PostCategoryForm
      initialData={{
        id: category.id,
        name: category.name,
        slug: category.slug,
        content: category.content,
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription,
        isActive: category.isActive ?? true,
        bannerImageId: category.bannerImageId,
        bannerImagePath
      }}
      pageTitle='Kategori Düzenle'
    />
  );
}
