import {
  Block,
  Lines,
  Panel,
  SectionLabel,
} from '@/components/loading/skeletons/primitives.jsx';

export const MatchmakerSkeleton = ({
  label = 'Loading AI University Matchmaker',
}) => (
  <div role="status" className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
    <span className="sr-only">{label}</span>
    <div className="space-y-6">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#fff3f8_0%,#f7ecf1_55%,#fff8fb_100%)] p-6 md:p-8">
        <div className="max-w-3xl space-y-5">
          <SectionLabel width="w-28" tone="bg-white/70" />
          <Block className="h-11 w-full max-w-xl rounded-full bg-white/70" />
          <Lines widths={['w-full max-w-3xl', 'w-4/5']} />
        </div>
      </div>
      <Panel className="space-y-5 p-5 md:p-7">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Block
                key={`step-pill-${index}`}
                className="h-10 w-28 rounded-full bg-[#ece7ea]"
              />
            ))}
          </div>
          <Block className="h-2 w-full rounded-full bg-[#ece7ea]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`field-${index}`} className="space-y-3">
              <SectionLabel width="w-28" />
              <Block className="h-12 rounded-2xl bg-[#ece7ea]" />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  </div>
);

export const ExploreSearchSkeleton = () => (
  <div role="status" className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
    <span className="sr-only">Loading university search</span>
    <div className="rounded-[32px] bg-light px-6 py-8 md:px-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Block className="h-8 w-full max-w-xl rounded-full" />
          <Lines widths={['w-full max-w-3xl', 'w-4/5']} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Block
              key={`filter-${index}`}
              className="h-12 rounded-xl bg-white/80"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ExploreResultSkeleton = () => (
  <div role="status" className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
    <span className="sr-only">Loading university details</span>
    <div className="rounded-[28px] bg-light p-6 md:p-8">
      <div className="grid gap-6 sm:grid-cols-[140px_minmax(0,1fr)_180px] sm:items-center">
        <Block className="h-28 rounded-2xl bg-white/80" />
        <div className="space-y-3">
          <Block className="h-7 w-4/5 rounded-full bg-white/80" />
          <Block className="h-4 w-3/5 rounded-full bg-white/80" />
          <Block className="h-4 w-2/5 rounded-full bg-white/80" />
        </div>
        <Block className="h-11 w-full rounded-full bg-white/80" />
      </div>
    </div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Panel className="space-y-5 p-5">
        <Block className="h-6 w-44 rounded-full bg-[#ece7ea]" />
        <Lines
          widths={['w-full', 'w-full', 'w-11/12', 'w-full', 'w-10/12', 'w-4/5']}
        />
      </Panel>
      <Panel className="space-y-4 p-5">
        <Block className="h-6 w-28 rounded-full bg-[#ece7ea]" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Block
            key={`side-block-${index}`}
            className="h-16 rounded-2xl bg-[#ece7ea]"
          />
        ))}
      </Panel>
    </div>
  </div>
);

export const PublicRecommendationsSkeleton = () => (
  <div role="status" className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
    <span className="sr-only">Loading recommendations</span>
    <Panel className="space-y-5 px-6 py-10 text-center md:px-10">
      <Block className="mx-auto h-4 w-32 rounded-full bg-[#ece7ea]" />
      <Block className="mx-auto h-10 w-full max-w-md rounded-full bg-[#ece7ea]" />
      <Block className="mx-auto h-4 w-full max-w-xl rounded-full bg-[#ece7ea]" />
      <Block className="mx-auto h-11 w-40 rounded-full bg-[#ece7ea]" />
    </Panel>
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Panel key={`recommendation-card-${index}`} className="space-y-4 p-5">
          <Block className="h-5 w-2/3 rounded-full bg-[#ece7ea]" />
          <Lines widths={['w-full', 'w-11/12', 'w-3/4']} />
        </Panel>
      ))}
    </div>
  </div>
);
