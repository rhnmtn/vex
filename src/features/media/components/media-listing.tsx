import { getMedia } from '@/features/media/actions/get-media';
import { searchParamsCache } from '@/lib/searchparams';
import { MediaTable, columns } from './media-tables';

export default async function MediaListingPage() {
  const page = searchParamsCache.get('page');
  const perPage = searchParamsCache.get('perPage');
  const filename = searchParamsCache.get('filename');
  const mimeType = searchParamsCache.get('mimeType');

  const { items, total } = await getMedia({
    page,
    limit: perPage,
    ...(filename && { filename }),
    ...(mimeType && { mimeType })
  });

  return (
    <MediaTable data={items} totalItems={total} columns={columns} />
  );
}
