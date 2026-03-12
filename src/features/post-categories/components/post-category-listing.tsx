import {
  getPostCategories,
  type PostCategoryRow
} from '@/features/post-categories/actions/get-post-categories';
import { searchParamsCache } from '@/lib/searchparams';
import { PostCategoryTable } from './post-category-tables';
import { columns } from './post-category-tables/columns';

export default async function PostCategoryListingPage() {
  const page = searchParamsCache.get('page');
  const name = searchParamsCache.get('name');
  const perPage = searchParamsCache.get('perPage');

  const { postCategories, total } = await getPostCategories({
    page: page ?? 1,
    limit: perPage ?? 10,
    ...(name && { name })
  });

  return (
    <PostCategoryTable<PostCategoryRow, unknown>
      data={postCategories}
      totalItems={total}
      columns={columns}
    />
  );
}
