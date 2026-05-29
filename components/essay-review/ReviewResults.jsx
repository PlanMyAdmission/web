import ContactGateCard from '@/components/ai-tools/ContactGateCard.jsx';

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

const shellClass = 'rounded-md border border-[#e8dde3] bg-white p-6 shadow-sm';

const getPalette = (score) =>
  SCORE_PALETTES.find((palette) => score >= palette.min) || SCORE_PALETTES[2];

const EmptyState = () => (
  <div className={`${shellClass} bg-light flex flex-col items-start gap-4`}>
    <span className="inline-flex items-center rounded-full bg-white border border-[#e8dde3] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-main">
      Review output
    </span>
    <h3 className="text-lg font-semibold text-[#3f1831]">
      Paste a draft to see your scored review.
    </h3>
    <p className="text-sm leading-6 text-grey">
      You&apos;ll get category scores, revision priorities, line-level rewrites,
      and a stronger sample excerpt in one pass.
    </p>
    <ul className="grid gap-2 text-sm text-grey">
      <li className="flex gap-2">
        <span className="text-main">•</span> Weighted rubric for admissions
      </li>
      <li className="flex gap-2">
        <span className="text-main">•</span> Specific feedback for SOPs &amp;
        supplements
      </li>
      <li className="flex gap-2">
        <span className="text-main">•</span> High-impact fixes before submission
      </li>
    </ul>
  </div>
);

const LoadingState = () => (
  <div className={`${shellClass} animate-pulse space-y-5`}>
    <div className="h-5 w-36 rounded-full bg-[#f1dfe8]" />
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="rounded-md bg-[#f2c4d8] p-5">
        <div className="mx-auto h-32 w-32 rounded-full bg-[#e8aac8]" />
        <div className="mx-auto mt-4 h-4 w-24 rounded-full bg-[#e8aac8]" />
      </div>
      <div className="space-y-4">
        <div className="h-24 rounded-md bg-[#f7ecf1]" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-20 rounded-md bg-[#f7ecf1]" />
          <div className="h-20 rounded-md bg-[#f7ecf1]" />
          <div className="h-20 rounded-md bg-[#f7ecf1]" />
        </div>
      </div>
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`score-skeleton-${index}`}
          className="h-36 rounded-md bg-[#f7ecf1]"
        />
      ))}
    </div>
  </div>
);

const ScoreCard = ({ item }) => {
  const score = Number(item?.score || 0);
  const palette = getPalette(score);

  return (
    <div className="rounded-md border border-[#e8dde3] bg-light p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-[#3f1831]">
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
      <h3 className="text-lg font-semibold text-[#3f1831]">{title}</h3>
    </div>
    <div className="mt-5 space-y-3">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-md border border-[#e8dde3] bg-light px-4 py-4 text-sm leading-6 text-grey"
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

export default function ReviewResults({
  results,
  isLoading,
  draftWordCount,
  runId,
  claimToken,
  unlocked = false,
  onUnlock,
}) {
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
          <div className="rounded-md bg-main p-5 text-white">
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
                <p className="text-xs font-semibold uppercase tracking-wider text-grey">
                  {results.documentType}
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-[#3f1831]">
                  {results.overallVerdict}
                </h3>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${scorePalette.badge}`}
              >
                {results.admissionsReadiness?.band}
              </span>
            </div>
            <p className="text-sm leading-6 text-grey">
              {results.admissionsReadiness?.summary}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-[#e8dde3] bg-light px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-grey">
                  Estimated words
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#3f1831]">
                  {displayedWordCount}
                </p>
              </div>
              <div className="rounded-md border border-[#e8dde3] bg-light px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-grey">
                  Strengths
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#3f1831]">
                  {results.strengths?.length || 0}
                </p>
              </div>
              <div className="rounded-md border border-[#e8dde3] bg-light px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-grey">
                  Priority fixes
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#3f1831]">
                  {results.priorityFixes?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {unlocked && results.coachSummary && (
        <div className={`${shellClass} bg-light`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-grey">
            Admissions coach summary
          </p>
          <p className="mt-3 text-base leading-7 text-grey">
            {results.coachSummary}
          </p>
        </div>
      )}

      {results.scoreBreakdown?.length > 0 && (
        <div className={shellClass}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-[#3f1831]">
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
          <h3 className="text-xl font-semibold text-[#3f1831]">
            Requested focus areas
          </h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {results.focusFeedback.map((item) => (
              <div
                key={item.focus}
                className="rounded-md border border-[#e8dde3] bg-light p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ab2f71]">
                  {item.focus}
                </p>
                <p className="mt-3 text-sm leading-6 text-grey">
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

      {!unlocked && (
        <div
          className={`${shellClass} bg-[linear-gradient(180deg,#fff5fa,#ffffff)]`}
        >
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-grey">
                Locked in your full review
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#3f1831]">
                Get every line edit, priority fix, and revised excerpt.
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-grey">
                <li>
                  • {results.priorityFixes?.length || 0} prioritized high-impact
                  fixes with revision moves
                </li>
                <li>
                  • {results.sentenceEdits?.length || 0} line-level before/after
                  rewrites with rationale
                </li>
                <li>• Stronger sample excerpt rewriting the weakest section</li>
                <li>
                  • Personalised admissions coach summary + next-draft checklist
                </li>
              </ul>
            </div>
            <ContactGateCard
              toolName="essay_review"
              runId={runId}
              claimToken={claimToken}
              title="Unlock the detailed feedback"
              subtitle="Line edits, sample rewrite, and the next-draft checklist — free, on WhatsApp + email."
              primaryCta="Send my detailed review"
              onSaved={onUnlock}
            />
          </div>
        </div>
      )}

      {unlocked && results.priorityFixes?.length > 0 && (
        <div className={shellClass}>
          <h3 className="text-xl font-semibold text-[#3f1831]">
            Highest-impact fixes
          </h3>
          <div className="mt-5 space-y-4">
            {results.priorityFixes.map((item, index) => (
              <div
                key={`${item.issue}-${index}`}
                className="rounded-md border border-[#e8dde3] bg-light p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-light px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-grey">
                    {item.priority} priority
                  </span>
                  <h4 className="text-lg font-semibold text-[#3f1831]">
                    {item.issue}
                  </h4>
                </div>
                <p className="mt-3 text-sm leading-6 text-grey">
                  {item.whyItMatters}
                </p>
                <div className="mt-4 rounded-md bg-light px-4 py-4 text-sm leading-6 text-grey">
                  <span className="font-semibold text-[#3f1831]">
                    Revision move:
                  </span>{' '}
                  {item.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {unlocked && results.sentenceEdits?.length > 0 && (
        <div className={shellClass}>
          <h3 className="text-xl font-semibold text-[#3f1831]">Line edits</h3>
          <div className="mt-5 space-y-4">
            {results.sentenceEdits.map((item, index) => (
              <div
                key={`${item.original}-${index}`}
                className="rounded-md border border-[#e8dde3] bg-light p-5"
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-grey">
                      Original
                    </p>
                    <p className="mt-3 text-sm leading-6 text-grey">
                      {item.original}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#118758]">
                      Improved
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#3f1831]">
                      {item.improved}
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-md bg-light px-4 py-4 text-sm leading-6 text-grey">
                  {item.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {unlocked && results.revisedExcerpt && (
        <div className={`${shellClass} bg-light`}>
          <h3 className="text-xl font-semibold text-[#3f1831]">
            Stronger sample excerpt
          </h3>
          <blockquote className="mt-5 rounded-md border border-[#e8dde3] bg-white px-5 py-5 text-base leading-8 text-grey">
            {results.revisedExcerpt}
          </blockquote>
        </div>
      )}

      {unlocked && results.nextDraftChecklist?.length > 0 && (
        <div className={shellClass}>
          <h3 className="text-xl font-semibold text-[#3f1831]">
            Next draft checklist
          </h3>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {results.nextDraftChecklist.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[#e8dde3] bg-light px-4 py-4 text-sm leading-6 text-grey"
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
