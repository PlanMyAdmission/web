'use client';

import React from 'react';
import styles from '@/components/ai-admission/AIAdmissionTool.module.css';
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => styles[name])
    .filter(Boolean)
    .join(' ');
const ExtrasStep = ({ formData, setField, onBack, onSubmit }) => {
  return (
    <div className={cx('pma-ai-form')}>
      <div className={cx('pma-ai-field')}>
        <label>Budget</label>
        <input value={formData.budget} onChange={setField('budget')} />
      </div>
      <div className={cx('pma-ai-field')}>
        <label>Timeline / Intake</label>
        <input value={formData.timeline} onChange={setField('timeline')} />
      </div>
      <div className={cx('pma-ai-field')}>
        <label>Work Experience</label>
        <textarea
          rows="2"
          value={formData.workExperience}
          onChange={setField('workExperience')}
        />
      </div>
      <div className={cx('pma-ai-field')}>
        <label>Extracurriculars</label>
        <textarea
          rows="2"
          value={formData.extracurriculars}
          onChange={setField('extracurriculars')}
        />
      </div>
      <div className={cx('pma-ai-field', 'pma-ai-field-full')}>
        <label>Additional Notes</label>
        <textarea
          rows="3"
          value={formData.notes}
          onChange={setField('notes')}
        />
      </div>
      <div className={cx('pma-ai-step-actions')}>
        <button type="button" className={cx('pma-ai-secondary')} onClick={onBack}>
          Back
        </button>
        <button type="button" className={cx('pma-ai-primary')} onClick={onSubmit}>
          Generate Report
        </button>
      </div>
    </div>
  );
};
export default ExtrasStep;
