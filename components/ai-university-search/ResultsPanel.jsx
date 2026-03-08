import React from 'react';
import uniStyles from '@/components/ai-university-search/AIUniversitySearch.module.css';

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

const ResultsPanel = ({ results }) => {
  if (!results) return null;

  return (
    <div className={cx('pma-uni-results')}>
      <h3>Your Family-Friendly University Matches</h3>
      {results.summary && <p className={cx('pma-uni-summary')}>{results.summary}</p>}

      <div className={cx('pma-uni-grid')}>
        {(results.universities || []).map((uni, index) => {
          const fitMeta = getFitMeta(uni.fit);
          return (
            <div className={cx('pma-uni-card')} key={`${uni.name}-${index}`}>
              <div className={cx('pma-uni-card-top')}>
                <span className={cx('pma-uni-rank')}>#{String(index + 1).padStart(2, '0')}</span>
                <span className={cx('pma-uni-fit-band')}>{fitMeta.fitBand}</span>
              </div>

              <div className={cx('pma-uni-card-header')}>
                <h4>{uni.name}</h4>
                <span className={cx('pma-uni-fit', fitMeta.className)}>{fitMeta.label}</span>
              </div>

              <p className={cx('pma-uni-meta')}>
                {uni.country || 'Country'} · {uni.program || 'Program'}
              </p>

              <p className={cx('pma-uni-reason')}>{uni.reason}</p>
            </div>
          );
        })}
      </div>

      {Array.isArray(results.nextSteps) && results.nextSteps.length > 0 && (
        <div className={cx('pma-uni-next')}>
          <h4>Suggested Next Steps</h4>
          <ul>
            {results.nextSteps.slice(0, 5).map((step, index) => (
              <li key={`next-${index}`}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
