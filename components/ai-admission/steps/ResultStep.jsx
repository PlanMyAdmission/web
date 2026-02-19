'use client';

import React from 'react';
import styles from '@/components/ai-admission/AIAdmissionTool.module.css';
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => styles[name])
    .filter(Boolean)
    .join(' ');
const ResultStep = ({ reportData, onDownload, onReset }) => {
  return (
    <>
      <div className={cx('pma-ai-actions')}>
        <button className={cx('pma-ai-secondary')} onClick={onReset} type="button">
          Start Over
        </button>
        <button className={cx('pma-ai-download')} onClick={onDownload} type="button">
          Download PDF Report
        </button>
      </div>

      {reportData && (
        <div className={cx('pma-ai-preview')}>
          <h3>Report Preview</h3>
          <p>{reportData.summary}</p>
          <div className={cx('pma-ai-preview-grid')}>
            <div>
              <h4>Strengths</h4>
              <ul>
                {(reportData.strengths || []).slice(0, 4).map((item, index) => (
                  <li key={`strength-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Risks</h4>
              <ul>
                {(reportData.risks || []).slice(0, 4).map((item, index) => (
                  <li key={`risk-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ResultStep;
