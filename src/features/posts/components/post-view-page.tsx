import { getPostById } from '@/features/posts/actions/get-post-by-id';
import { notFound } from 'next/navigation';
import PostForm from './post-form';

type PostViewPageProps = {
  postId: string;
};

export default async function PostViewPage({ postId }: PostViewPageProps) {
  if (postId === 'new') {
    return (
      <PostForm
        initialData={null}
        pageTitle='Yeni Yazı'
      />
    );
  }

  const id = parseInt(postId, 10);
  if (Number.isNaN(id)) {
    notFound();
  }

  const post = await getPostById(id);
  if (!post) {
    notFound();
  }

  return (
    <PostForm
      initialData={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        isActive: post.isActive ?? true,
        isSticky: post.isSticky ?? false,
        publishedAt: post.publishedAt,
        categoryIds: post.categoryIds,
        featuredImageId: post.featuredImageId,
        featuredImagePath: post.featuredImagePath ?? undefined
      }}
      pageTitle='Yazı Düzenle'
    />
  );
}
