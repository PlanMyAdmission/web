import React from 'react';
import uniStyles from '@/components/ai-university-search/AIUniversitySearch.module.css';
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => uniStyles[name])
    .filter(Boolean)
    .join(' ');
const ResultsPanel = ({ results }) => {
  if (!results) return null;
  return (
    <div className={cx('pma-uni-results')}>
      <h3>Recommended Universities</h3>
      {results.summary && <p className={cx('pma-uni-summary')}>{results.summary}</p>}
      <div className={cx('pma-uni-grid')}>
        {(results.universities || []).map((uni, index) => (
          <div className={cx('pma-uni-card')} key={`${uni.name}-${index}`}>
            <div className={cx('pma-uni-card-header')}>
              <h4>{uni.name}</h4>
              <span className={cx('pma-uni-fit', uni.fit?.toLowerCase() || '')}>
                {uni.fit || 'Fit'}
              </span>
            </div>
            <p className={cx('pma-uni-meta')}>
              {uni.country || 'Country'} · {uni.program || 'Program'}
            </p>
            <p className={cx('pma-uni-reason')}>{uni.reason}</p>
          </div>
        ))}
      </div>
      {Array.isArray(results.nextSteps) && results.nextSteps.length > 0 && (
        <div className={cx('pma-uni-next')}>
          <h4>Next Steps</h4>
          <ul>
            {results.nextSteps.slice(0, 4).map((step, index) => (
              <li key={`next-${index}`}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default ResultsPanel;
