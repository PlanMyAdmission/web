import { Block, Lines, Panel } from '@/components/loading/skeletons/primitives.jsx';

export const BlogIndexSkeleton = () => (
  <div role="status" className="px-4 py-6 md:px-6 md:py-10">
    <span className="sr-only">Loading blog posts</span>
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="rounded-[28px] bg-light p-5 md:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`blog-card-${index}`} className="rounded-2xl bg-white p-3">
              <Block className="h-[220px] rounded-xl" />
              <div className="space-y-3 py-4">
                <Block className="h-7 w-4/5 rounded-full" />
                <Lines widths={['w-full', 'w-4/5']} />
                <Block className="h-4 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[28px] bg-light p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
          <div className="space-y-4">
            <Block className="h-8 w-56 rounded-full" />
            <Lines widths={['w-full max-w-2xl', 'w-3/4']} />
          </div>
          <Block className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export const BlogPostSkeleton = () => (
  <div role="status" className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
    <span className="sr-only">Loading article</span>
    <div className="rounded-[28px] bg-light px-5 py-8 md:p-10">
      <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
        <Block className="h-[260px] rounded-[24px]" />
        <div className="space-y-5">
          <Block className="h-10 w-full rounded-full" />
          <Block className="h-10 w-4/5 rounded-full" />
          <Block className="h-4 w-40 rounded-full" />
        </div>
      </div>
    </div>
    <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-6">
        <Lines widths={['w-full', 'w-full', 'w-5/6']} />
        <Panel className="bg-light p-5">
          <Block className="h-7 w-52 rounded-full" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Block key={`toc-line-${index}`} className="h-4 w-4/5 rounded-full" />
            ))}
          </div>
        </Panel>
      </div>
      <div className="hidden space-y-4 md:block">
        <Block className="h-7 w-40 rounded-full" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`popular-post-${index}`} className="flex gap-3 border-b border-main/10 pb-4">
            <Block className="h-20 w-24 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Block className="h-4 w-full rounded-full" />
              <Block className="h-4 w-3/4 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
