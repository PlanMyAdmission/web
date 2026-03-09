import { AdminToolbar, Block, Lines, Panel, SectionLabel } from '@/components/loading/skeletons/primitives.jsx';

export const AdminLeadsSkeleton = () => (
  <div role="status" className="space-y-4">
    <span className="sr-only">Loading leads</span>
    <AdminToolbar />
    <div className="grid min-h-[70vh] gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Panel>
        <div className="space-y-2 p-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`lead-row-${index}`} className="rounded-md border border-main/8 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <Block className="h-4 w-3/5 rounded-full bg-[#ece7ea]" />
                  <Block className="h-3 w-4/5 rounded-full bg-[#ece7ea]" />
                  <Block className="h-3 w-2/5 rounded-full bg-[#ece7ea]" />
                </div>
                <Block className="h-7 w-20 rounded-md bg-[#ece7ea]" />
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <div className="border-b border-main/10 p-4">
          <Block className="h-5 w-40 rounded-full bg-[#ece7ea]" />
          <Block className="mt-2 h-3 w-56 rounded-full bg-[#ece7ea]" />
          <Block className="mt-4 h-10 w-44 rounded-md bg-[#ece7ea]" />
        </div>
        <div className="space-y-5 p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`lead-section-${index}`} className="space-y-3">
              <SectionLabel />
              <Lines widths={['w-full', 'w-full', 'w-11/12', 'w-4/5']} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  </div>
);

export const AdminBlogsSkeleton = () => (
  <div role="status" className="space-y-4">
    <span className="sr-only">Loading blog editor</span>
    <AdminToolbar includeButton />
    <div className="grid min-h-[70vh] gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <Panel className="p-3">
        <Block className="h-9 w-full rounded-md bg-[#ece7ea]" />
        <div className="mt-3 space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`post-row-${index}`} className="rounded-md border border-main/8 p-3">
              <Block className="h-4 w-4/5 rounded-full bg-[#ece7ea]" />
              <Block className="mt-2 h-3 w-1/2 rounded-full bg-[#ece7ea]" />
              <Block className="mt-3 h-6 w-20 rounded-md bg-[#ece7ea]" />
            </div>
          ))}
        </div>
      </Panel>
      <Panel className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`editor-field-${index}`} className={index === 0 ? 'space-y-3 md:col-span-2' : 'space-y-3'}>
              <SectionLabel />
              <Block className="h-11 rounded-md bg-[#ece7ea]" />
            </div>
          ))}
          <div className="space-y-3 md:col-span-2">
            <SectionLabel width="w-28" />
            <Block className="h-48 rounded-lg bg-[#ece7ea]" />
          </div>
          <div className="space-y-3 md:col-span-2">
            <SectionLabel width="w-28" />
            <Block className="h-64 rounded-lg bg-[#ece7ea]" />
          </div>
        </div>
      </Panel>
    </div>
  </div>
);

export const AdminWorkspaceSkeleton = () => <AdminLeadsSkeleton />;

export const AdminLoginSkeleton = () => (
  <div role="status" className="flex min-h-screen items-center justify-center bg-[#faf7f9] px-4 py-8">
    <span className="sr-only">Loading admin login</span>
    <div className="w-full max-w-md rounded-[24px] border border-main/10 bg-white p-8">
      <div className="space-y-3">
        <SectionLabel width="w-20" />
        <Block className="h-8 w-40 rounded-full bg-[#ece7ea]" />
        <Lines widths={['w-full', 'w-4/5']} />
      </div>
      <div className="mt-6 space-y-3">
        <Block className="h-11 w-full rounded-md bg-[#ece7ea]" />
        <Block className="h-4 w-24 rounded-full bg-[#ece7ea]" />
      </div>
    </div>
  </div>
);
