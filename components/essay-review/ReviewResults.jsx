const SCORE_PALETTES = [
  {
    min: 85,
    badge: 'bg-[#def7ea] text-[#146c43]',
    bar: 'bg-[#18a46d]',
  },
  {
    min: 72,
    badge: 'bg-[#fff1d6] text-[#9a6700]',
    bar: 'bg-[#f59e0b]',
  },
  {
    min: 0,
    badge: 'bg-[#fde7e7] text-[#b42318]',
    bar: 'bg-[#ef4444]',
  },
];

const shellClass =
  'rounded-[32px] border border-[#eadde4] bg-white/90 p-6 shadow-[0_24px_70px_rgba(58,23,52,0.08)] backdrop-blur';

const getPalette = (score) =>
  SCORE_PALETTES.find((palette) => score >= palette.min) || SCORE_PALETTES[2];

const EmptyState = () => (
  <div
    className={`${shellClass} bg-[linear-gradient(180deg,rgba(255,250,252,0.98),rgba(249,241,245,0.94))]`}
  >
    <div className="space-y-5">
      <div className="inline-flex items-center rounded-full bg-[#fff0f6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#b4236d]">
        Review output
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#341338]">
          Paste a draft to get a scored admissions review.
        </h3>
        <p className="max-w-2xl text-sm leading-6 text-[#6b586f]">
          You will get category scores, revision priorities, line-level
          rewrites, and a stronger sample excerpt in one pass.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          'Weighted rubric built for college applications',
          'Specific feedback for SOPs, personal statements, and supplements',
          'High-impact fixes before you submit the next draft',
        ].map((item) => (
          <div
            key={item}
            className="rounded-[24px] border border-[#efe5ea] bg-white px-4 py-5 text-sm font-medium leading-6 text-[#4e3852]"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LoadingState = () => (
  <div className={`${shellClass} animate-pulse space-y-5`}>
    <div className="h-5 w-36 rounded-full bg-[#f1dfe8]" />
    <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
      <div className="rounded-[28px] bg-[#f7ecf1] p-5">
        <div className="mx-auto h-28 w-28 rounded-full bg-[#eedbe5]" />
        <div className="mx-auto mt-4 h-4 w-24 rounded-full bg-[#eedbe5]" />
      </div>
      <div className="space-y-4">
        <div className="h-24 rounded-[28px] bg-[#f7ecf1]" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-28 rounded-[24px] bg-[#f7ecf1]" />
          <div className="h-28 rounded-[24px] bg-[#f7ecf1]" />
        </div>
      </div>
    </div>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`score-skeleton-${index}`}
          className="h-36 rounded-[24px] bg-[#f7ecf1]"
        />
      ))}
    </div>
  </div>
);

const ScoreCard = ({ item }) => {
  const score = Number(item?.score || 0);
  const palette = getPalette(score);

  return (
    <div className="rounded-[24px] border border-[#f0e6eb] bg-[#fffdfd] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-[#341338]">
            {item.category}
          </h4>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8d7891]">
            {item.verdict}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${palette.badge}`}
        >
          {score}/100
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f3e9ee]">
        <div
          className={`h-full rounded-full transition-all ${palette.bar}`}
          style={{ width: `${Math.max(4, score)}%` }}
        />
      </div>
      <p className="mt-4 text-sm leading-6 text-[#645167]">
        {item.explanation}
      </p>
    </div>
  );
};

const ListCard = ({ title, items, accent }) => (
  <div className={`${shellClass} h-full`}>
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 rounded-full ${accent}`} />
      <h3 className="text-lg font-semibold text-[#341338]">{title}</h3>
    </div>
    <div className="mt-5 space-y-3">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-[22px] border border-[#f0e6eb] bg-[#fffdfd] px-4 py-4 text-sm leading-6 text-[#4e3852]"
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

export default function ReviewResults({ results, isLoading, draftWordCount }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!results) {
    return <EmptyState />;
  }

  const overallScore = Number(results.overallScore || 0);
  const scorePalette = getPalette(overallScore);
  const estimatedWordCount = Number(results.estimatedWordCount || 0);
  const displayedWordCount = estimatedWordCount || draftWordCount || 0;

  return (
    <div className="space-y-6">
      <div className={`${shellClass}`}>
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="rounded-[28px] bg-[linear-gradient(180deg,#341338,#5a1f58)] p-5 text-white">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-white/10 text-4xl font-semibold tracking-[-0.05em]">
              {overallScore}
            </div>
            <p className="mt-4 text-center text-sm uppercase tracking-[0.22em] text-[#f8dce9]">
              Overall score
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a18ca5]">
                  {results.documentType}
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#341338]">
                  {results.overallVerdict}
                </h3>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${scorePalette.badge}`}
              >
                {results.admissionsReadiness?.band}
              </span>
            </div>
            <p className="text-sm leading-6 text-[#5f4a63]">
              {results.admissionsReadiness?.summary}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-[#f0e6eb] bg-[#fffdfd] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#9a879e]">
                  Estimated words
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#341338]">
                  {displayedWordCount}
                </p>
              </div>
              <div className="rounded-[24px] border border-[#f0e6eb] bg-[#fffdfd] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#9a879e]">
                  Strengths
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#341338]">
                  {results.strengths?.length || 0}
                </p>
              </div>
              <div className="rounded-[24px] border border-[#f0e6eb] bg-[#fffdfd] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#9a879e]">
                  Priority fixes
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#341338]">
                  {results.priorityFixes?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {results.coachSummary && (
        <div
          className={`${shellClass} bg-[linear-gradient(180deg,#fffafc,#fff2f7)]`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b4236d]">
            Admissions coach summary
          </p>
          <p className="mt-3 text-base leading-7 text-[#4c3550]">
            {results.coachSummary}
          </p>
        </div>
      )}

      {results.scoreBreakdown?.length > 0 && (
        <div className={shellClass}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-[#341338]">
              Rubric breakdown
            </h3>
            <p className="text-sm text-[#7f6c83]">
              Six-category admissions lens
            </p>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {results.scoreBreakdown.map((item) => (
              <ScoreCard key={item.category} item={item} />
            ))}
          </div>
        </div>
      )}

      {results.focusFeedback?.length > 0 && (
        <div className={shellClass}>
          <h3 className="text-xl font-semibold text-[#341338]">
            Requested focus areas
          </h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {results.focusFeedback.map((item) => (
              <div
                key={item.focus}
                className="rounded-[24px] border border-[#f0e6eb] bg-[#fffdfd] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ab2f71]">
                  {item.focus}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#4e3852]">
                  {item.insight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ListCard
          title="What already works"
          items={results.strengths || []}
          accent="bg-[#22a26f]"
        />
        <ListCard
          title="What needs revision"
          items={results.improvementAreas || []}
          accent="bg-[#ef4444]"
        />
      </div>

      {results.priorityFixes?.length > 0 && (
        <div className={shellClass}>
          <h3 className="text-xl font-semibold text-[#341338]">
            Highest-impact fixes
          </h3>
          <div className="mt-5 space-y-4">
            {results.priorityFixes.map((item, index) => (
              <div
                key={`${item.issue}-${index}`}
                className="rounded-[26px] border border-[#f0e6eb] bg-[#fffdfd] p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-[#fff0f6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#b4236d]">
                    {item.priority} priority
                  </span>
                  <h4 className="text-lg font-semibold text-[#341338]">
                    {item.issue}
                  </h4>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5f4a63]">
                  {item.whyItMatters}
                </p>
                <div className="mt-4 rounded-[20px] bg-[#faf2f6] px-4 py-4 text-sm leading-6 text-[#4e3852]">
                  <span className="font-semibold text-[#341338]">
                    Revision move:
                  </span>{' '}
                  {item.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.sentenceEdits?.length > 0 && (
        <div className={shellClass}>
          <h3 className="text-xl font-semibold text-[#341338]">Line edits</h3>
          <div className="mt-5 space-y-4">
            {results.sentenceEdits.map((item, index) => (
              <div
                key={`${item.original}-${index}`}
                className="rounded-[24px] border border-[#f0e6eb] bg-[#fffdfd] p-5"
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b869e]">
                      Original
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#6a576d]">
                      {item.original}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#118758]">
                      Improved
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#341338]">
                      {item.improved}
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-[20px] bg-[#faf2f6] px-4 py-4 text-sm leading-6 text-[#4e3852]">
                  {item.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.revisedExcerpt && (
        <div
          className={`${shellClass} bg-[linear-gradient(180deg,#fffdfd,#fff4f8)]`}
        >
          <h3 className="text-xl font-semibold text-[#341338]">
            Stronger sample excerpt
          </h3>
          <blockquote className="mt-5 rounded-[26px] border border-[#f1d8e3] bg-white px-5 py-5 text-base leading-8 text-[#4c3550]">
            {results.revisedExcerpt}
          </blockquote>
        </div>
      )}

      {results.nextDraftChecklist?.length > 0 && (
        <div className={shellClass}>
          <h3 className="text-xl font-semibold text-[#341338]">
            Next draft checklist
          </h3>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {results.nextDraftChecklist.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-[#efe5ea] bg-[#fffdfd] px-4 py-4 text-sm leading-6 text-[#4e3852]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
