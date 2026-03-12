/**
 * Streaming sırasında gösterilen minimal skeleton.
 * Hero + blog alanı için hafif placeholder.
 */
export default function WebLoading() {
  return (
    <div className='mx-auto w-full max-w-7xl animate-pulse px-4 py-16 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl space-y-4 text-center'>
        <div className='bg-muted mx-auto h-10 w-3/4 rounded-lg' />
        <div className='bg-muted mx-auto h-6 w-1/2 rounded' />
        <div className='mt-8 flex justify-center gap-4'>
          <div className='bg-muted h-10 w-32 rounded-md' />
          <div className='bg-muted h-10 w-28 rounded-md' />
        </div>
      </div>
      <div className='mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='space-y-3'>
            <div className='bg-muted aspect-video rounded-lg' />
            <div className='bg-muted h-5 w-4/5 rounded' />
            <div className='bg-muted h-4 w-full rounded' />
          </div>
        ))}
      </div>
    </div>
  );
}
