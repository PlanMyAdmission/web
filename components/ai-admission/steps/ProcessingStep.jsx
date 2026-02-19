import React from 'react';
import styles from '@/components/ai-admission/AIAdmissionTool.module.css';
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => styles[name])
    .filter(Boolean)
    .join(' ');
const ProcessingStep = ({ message }) => {
  return (
    <div className={cx('pma-ai-processing')}>
      <h3>Evaluating Profile</h3>
      <p>Analyzing your profile...</p>
      <div className={cx('pma-ai-processing-message')}>{message}</div>
    </div>
  );
};
export default ProcessingStep;
