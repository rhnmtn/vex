import {
  getPosts,
  type PostRow
} from '@/features/posts/actions/get-posts';
import { searchParamsCache } from '@/lib/searchparams';
import { PostTable } from './post-tables';
import { columns } from './post-tables/columns';

export default async function PostListingPage() {
  const page = searchParamsCache.get('page');
  const title = searchParamsCache.get('title');
  const perPage = searchParamsCache.get('perPage');

  const { posts: postList, total } = await getPosts({
    page: page ?? 1,
    limit: perPage ?? 10,
    ...(title && { title })
  });

  return (
    <PostTable<PostRow, unknown>
      data={postList}
      totalItems={total}
      columns={columns}
    />
  );
}
