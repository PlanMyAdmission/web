'use client';

import React from 'react';
import uniStyles from '@/components/ai-university-search/AIUniversitySearch.module.css';
import ContactGateCard from '@/components/ai-tools/ContactGateCard.jsx';

const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => uniStyles[name])
    .filter(Boolean)
    .join(' ');

const getFitMeta = (fitValue) => {
  const normalized = `${fitValue || ''}`.toLowerCase();

  if (
    normalized.includes('aspirational') ||
    normalized.includes('dream') ||
    normalized.includes('reach') ||
    normalized.includes('ambitious')
  ) {
    return {
      label: 'Aspirational',
      className: 'aspirational',
      fitBand: 'Stretch',
    };
  }

  if (normalized.includes('safe') || normalized.includes('safer')) {
    return {
      label: 'Safer Choice',
      className: 'safer',
      fitBand: 'Secure',
    };
  }

  return {
    label: 'Strong Match',
    className: 'strong',
    fitBand: 'Balanced',
  };
};

const ResultsPanel = ({
  results,
  preview,
  runId,
  claimToken,
  unlocked,
  onUnlock,
}) => {
  if (!results && !preview) return null;

  const universities = unlocked
    ? results?.universities || []
    : preview?.universities || (results?.universities || []).slice(0, 3);

  const lockedCount = unlocked
    ? 0
    : Math.max(
        (results?.universities?.length || preview?.totalCount || 10) -
          universities.length,
        0,
      );

  const summary = preview?.summary || results?.summary || '';
  const nextSteps = unlocked
    ? results?.nextSteps || []
    : preview?.nextSteps || (results?.nextSteps || []).slice(0, 2);

  return (
    <div className={cx('pma-uni-results')}>
      <h3>Your Family-Friendly University Matches</h3>
      {summary ? <p className={cx('pma-uni-summary')}>{summary}</p> : null}

      <div className={cx('pma-uni-grid')}>
        {universities.map((uni, index) => {
          const fitMeta = getFitMeta(uni.fit);
          return (
            <div className={cx('pma-uni-card')} key={`${uni.name}-${index}`}>
              <div className={cx('pma-uni-card-top')}>
                <span className={cx('pma-uni-rank')}>
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <span className={cx('pma-uni-fit-band')}>
                  {fitMeta.fitBand}
                </span>
              </div>

              <div className={cx('pma-uni-card-header')}>
                <h4>{uni.name}</h4>
                <span className={cx('pma-uni-fit', fitMeta.className)}>
                  {fitMeta.label}
                </span>
              </div>

              <p className={cx('pma-uni-meta')}>
                {uni.country || 'Country'} · {uni.program || 'Program'}
              </p>

              <p className={cx('pma-uni-reason')}>{uni.reason}</p>
            </div>
          );
        })}

        {!unlocked && lockedCount > 0
          ? Array.from({ length: Math.min(lockedCount, 4) }).map((_, index) => (
              <div
                className={cx('pma-uni-card', 'pma-uni-card-locked')}
                key={`locked-${index}`}
              >
                <div className={cx('pma-uni-card-top')}>
                  <span className={cx('pma-uni-rank')}>
                    #{String(universities.length + index + 1).padStart(2, '0')}
                  </span>
                  <span className={cx('pma-uni-fit-band')}>Hidden</span>
                </div>
                <div className={cx('pma-uni-card-header')}>
                  <h4>•••••••••</h4>
                </div>
                <p className={cx('pma-uni-meta')}>Unlock to view</p>
                <p className={cx('pma-uni-reason')}>
                  Share contact details to reveal {lockedCount} more curated
                  matches.
                </p>
              </div>
            ))
          : null}
      </div>

      {!unlocked ? (
        <div className={cx('pma-uni-gate-wrap')}>
          <ContactGateCard
            toolName="university_matchmaker"
            runId={runId}
            claimToken={claimToken}
            title={`Unlock all ${preview?.totalCount || 10} university matches`}
            subtitle="Free, instant — your full shortlist on WhatsApp + email."
            primaryCta="Reveal my full shortlist"
            onSaved={onUnlock}
          />
        </div>
      ) : null}

      {unlocked && Array.isArray(nextSteps) && nextSteps.length > 0 ? (
        <div className={cx('pma-uni-next')}>
          <h4>Suggested Next Steps</h4>
          <ul>
            {nextSteps.slice(0, 6).map((step, index) => (
              <li key={`next-${index}`}>{step}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default ResultsPanel;
