'use client';

import React from 'react';
import styles from '@/components/ai-admission/AIAdmissionTool.module.css';
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => styles[name])
    .filter(Boolean)
    .join(' ');
const StartStep = ({
  mode,
  onModeChange,
  pdfFile,
  onFileChange,
  formData,
  setField,
  onContinue,
  onAnalyze,
}) => {
  return (
    <div className={cx('pma-ai-flow-card')}>
      <div className={cx('pma-ai-flow-options')}>
        <button
          type="button"
          className={cx('pma-ai-mode-btn', mode === 'pdf' ? 'active' : '')}
          onClick={() => onModeChange('pdf')}
        >
          Upload PDF
        </button>
        <button
          type="button"
          className={cx('pma-ai-mode-btn', mode === 'form' ? 'active' : '')}
          onClick={() => onModeChange('form')}
        >
          Enter Details
        </button>
      </div>

      {mode === 'pdf' ? (
        <div className={cx('pma-ai-upload')}>
          <label className={cx('pma-ai-upload-label')}>
            Upload profile PDF
            <input
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
            />
          </label>
          <p className={cx('pma-ai-upload-hint')}>
            We send the PDF to Gemini only for analysis. Nothing is stored.
          </p>
          {pdfFile && (
            <div className={cx('pma-ai-upload-file')}>Selected: {pdfFile.name}</div>
          )}
          <div className={cx('pma-ai-step-actions')}>
            <button
              type="button"
              className={cx('pma-ai-primary')}
              onClick={onAnalyze}
            >
              Analyze Profile
            </button>
          </div>
        </div>
      ) : (
        <div className={cx('pma-ai-form')}>
          <div className={cx('pma-ai-field')}>
            <label>First Name</label>
            <input value={formData.fullName} onChange={setField('fullName')} />
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Last Name</label>
            <input value={formData.lastName} onChange={setField('lastName')} />
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Email</label>
            <input value={formData.email} onChange={setField('email')} />
          </div>
          <div className={cx('pma-ai-step-actions')}>
            <button
              type="button"
              className={cx('pma-ai-primary')}
              onClick={onContinue}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default StartStep;
