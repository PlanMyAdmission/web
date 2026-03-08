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
      <div className={cx('pma-ai-form-section', 'pma-ai-field-full')}>
        <h3 className={cx('pma-ai-section-heading')}>Budget Planning</h3>
        <p className={cx('pma-ai-section-subtext')}>
          Enter your annual budget. INR works best if you are applying from India.
        </p>
        <div className={cx('pma-ai-section-grid')}>
          <div className={cx('pma-ai-field')}>
            <label>Budget Currency</label>
            <select
              value={formData.budgetCurrency}
              onChange={setField('budgetCurrency')}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Yearly Budget Amount</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.budgetAmount}
              onChange={setField('budgetAmount')}
              placeholder="Example: 2000000"
            />
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Budget Covers</label>
            <select
              value={formData.budgetIncludes}
              onChange={setField('budgetIncludes')}
            >
              <option value="tuition_living">Tuition + Living</option>
              <option value="tuition_only">Tuition only</option>
            </select>
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Funding Plan</label>
            <select value={formData.fundingPlan} onChange={setField('fundingPlan')}>
              <option value="">Select plan</option>
              <option value="Self-funded">Self-funded</option>
              <option value="Education loan">Education loan</option>
              <option value="Scholarship dependent">Scholarship dependent</option>
            </select>
          </div>
        </div>
      </div>

      <div className={cx('pma-ai-form-section', 'pma-ai-field-full')}>
        <h3 className={cx('pma-ai-section-heading')}>Timeline and Experience</h3>
        <p className={cx('pma-ai-section-subtext')}>
          This helps the assistant prioritize realistic deadlines and actions.
        </p>
        <div className={cx('pma-ai-section-grid')}>
          <div className={cx('pma-ai-field')}>
            <label>Target Intake</label>
            <select
              value={formData.targetIntake}
              onChange={setField('targetIntake')}
            >
              <option value="">Select intake</option>
              <option value="Fall 2026">Fall 2026</option>
              <option value="Spring 2027">Spring 2027</option>
              <option value="Fall 2027">Fall 2027</option>
            </select>
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Application Stage</label>
            <select
              value={formData.applicationStage}
              onChange={setField('applicationStage')}
            >
              <option value="">Select stage</option>
              <option value="Shortlisting">Shortlisting</option>
              <option value="Preparing exams">Preparing exams</option>
              <option value="Applying">Applying</option>
              <option value="Awaiting admits">Awaiting admits</option>
            </select>
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Deadline Urgency</label>
            <select
              value={formData.deadlineUrgency}
              onChange={setField('deadlineUrgency')}
            >
              <option value="">Select urgency</option>
              <option value="Less than 3 months">Less than 3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Work Experience (months)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.workExperienceMonths}
              onChange={setField('workExperienceMonths')}
              placeholder="Example: 18"
            />
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Work Experience Highlights</label>
            <textarea
              rows="2"
              value={formData.workExperience}
              onChange={setField('workExperience')}
              placeholder="Role, impact, internships, projects"
            />
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Extracurriculars</label>
            <textarea
              rows="2"
              value={formData.extracurriculars}
              onChange={setField('extracurriculars')}
              placeholder="Clubs, volunteering, leadership, achievements"
            />
          </div>
          <div className={cx('pma-ai-field', 'pma-ai-field-full')}>
            <label>Additional Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={setField('notes')}
              placeholder="Any constraints or preferences"
            />
          </div>
        </div>
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
