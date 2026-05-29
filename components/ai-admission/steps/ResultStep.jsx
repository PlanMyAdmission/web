'use client';

import React from 'react';
import ContactGateCard from '@/components/ai-tools/ContactGateCard.jsx';
import { AIToolCard } from '@/components/ai-tools/AIToolShell.jsx';

const ScoreHero = ({ score, summary }) => (
  <div className="rounded-md border border-[#e8dde3] bg-white shadow-sm p-6 md:p-7 flex flex-col md:flex-row gap-6 items-start">
    <div className="flex-shrink-0">
      <div className="w-24 h-24 rounded-md bg-main text-white flex flex-col items-center justify-center overflow-hidden">
        <span className="text-3xl font-bold leading-none">{score || '—'}</span>
        <span className="text-[10px] uppercase tracking-wider mt-1 opacity-90">
          Fit Score
        </span>
      </div>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs uppercase tracking-wider text-main font-semibold mb-1">
        Admission Outlook
      </p>
      <p className="text-base text-[#3f1831] leading-relaxed break-words">{summary}</p>
    </div>
  </div>
);

const ListCard = ({ title, items, tone = 'neutral' }) => {
  const dot =
    tone === 'good'
      ? 'bg-green-500'
      : tone === 'risk'
        ? 'bg-red-400'
        : 'bg-main';
  return (
    <div className="rounded-md border border-[#e8dde3] bg-white p-5">
      <h4 className="text-sm font-semibold text-[#3f1831] mb-3">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-sm text-[#3f1831] leading-relaxed"
          >
            <span
              className={`mt-1.5 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`}
            />
            <span className="min-w-0 break-words">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ResultStep = ({
  reportData,
  preview,
  runId,
  claimToken,
  unlocked,
  onUnlock,
  onDownload,
  onReset,
}) => {
  const summary = preview?.summary || reportData?.summary || '';
  const score = preview?.score || reportData?.score || '';
  const strengthsAll = reportData?.strengths || [];
  const risksAll = reportData?.risks || [];
  const strengthsPreview = preview?.strengths?.length
    ? preview.strengths
    : strengthsAll.slice(0, 3);
  const risksPreview = preview?.risks?.length
    ? preview.risks
    : risksAll.slice(0, 3);
  const recommendedPrograms = reportData?.recommendedPrograms || [];
  const advice = reportData?.advice || [];

  return (
    <div className="space-y-5">
      <ScoreHero score={score} summary={summary} />

      <div className="grid gap-4 md:grid-cols-2">
        <ListCard title="Top strengths" items={strengthsPreview} tone="good" />
        <ListCard title="Top risks" items={risksPreview} tone="risk" />
      </div>

      {unlocked ? (
        <>
          {recommendedPrograms.length ? (
            <AIToolCard>
              <h4 className="text-sm font-semibold text-[#3f1831] mb-3">
                Recommended programs
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                {recommendedPrograms.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-[#e8dde3] bg-light p-4"
                  >
                    <p className="text-sm font-semibold text-[#3f1831]">
                      {p.program}
                    </p>
                    <p className="text-xs text-grey mt-0.5">{p.country}</p>
                    <p className="text-sm text-grey mt-2 leading-relaxed">
                      {p.reason}
                    </p>
                  </div>
                ))}
              </div>
            </AIToolCard>
          ) : null}

          {advice.length ? (
            <AIToolCard>
              <h4 className="text-sm font-semibold text-[#3f1831] mb-3">
                Action plan
              </h4>
              <ol className="space-y-2.5">
                {advice.map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-[#3f1831] leading-relaxed"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-main text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="min-w-0">{a}</span>
                  </li>
                ))}
              </ol>
            </AIToolCard>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onDownload}
              className="flex-1 px-6 py-3 rounded-md bg-main text-white font-semibold hover:bg-main/90 transition-colors"
            >
              Download PDF report
            </button>
            <button
              type="button"
              onClick={onReset}
              className="px-6 py-3 rounded-md border border-[#e8dde3] text-[#3f1831] hover:bg-light transition-colors"
            >
              Start over
            </button>
          </div>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-[1fr_minmax(0,420px)] items-start">
          <div className="rounded-md border border-[#e8dde3] bg-light p-5">
            <h4 className="text-sm font-semibold text-[#3f1831] mb-3">
              Locked in your full report
            </h4>
            <ul className="space-y-2 text-sm text-grey">
              <li className="flex gap-2">
                <span className="text-main">•</span>{' '}
                {recommendedPrograms.length || 'Personalized'} program matches
                with fit reasoning
              </li>
              <li className="flex gap-2">
                <span className="text-main">•</span> Step-by-step action plan (
                {advice.length || 'several'} items)
              </li>
              <li className="flex gap-2">
                <span className="text-main">•</span> Downloadable PDF report
              </li>
            </ul>
            <div className="mt-4 grid gap-2">
              {(recommendedPrograms.length
                ? recommendedPrograms
                : [
                    { program: '••••••', country: '•••' },
                    { program: '••••••', country: '•••' },
                  ]
              )
                .slice(0, 3)
                .map((p, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-[#e8dde3] bg-white p-3 blur-sm select-none pointer-events-none"
                  >
                    <p className="text-sm font-semibold text-[#3f1831]">
                      {p.program} — {p.country}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          <ContactGateCard
            toolName="admission_evaluation"
            runId={runId}
            claimToken={claimToken}
            title="Unlock your full admission report"
            subtitle="Program matches, action plan, and PDF on WhatsApp + email."
            primaryCta="Send me my report"
            onSaved={onUnlock}
          />
        </div>
      )}
    </div>
  );
};

export default ResultStep;
