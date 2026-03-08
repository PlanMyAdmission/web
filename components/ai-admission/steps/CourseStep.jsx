'use client';

import React from 'react';
import styles from '@/components/ai-admission/AIAdmissionTool.module.css';
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => styles[name])
    .filter(Boolean)
    .join(' ');

const targetCountries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'Australia',
  'Ireland',
  'Singapore',
  'New Zealand',
];

const degreeLevels = ['UG', 'PG', 'PhD'];

const programAreas = [
  'Computer Science',
  'Business and Management',
  'Engineering',
  'Data Science and AI',
  'Public Health',
  'Finance and Economics',
  'Law',
  'Design and Media',
];

const scoreTypePlaceholders = {
  PERCENTAGE_100: 'Example: 82',
  CGPA_10: 'Example: 8.2',
  GPA_4: 'Example: 3.6',
};

const CourseStep = ({ formData, setField, onBack, onNext }) => {
  const isEnglishScoreDisabled = formData.englishTest === 'NOT_TAKEN';
  const isAptitudeScoreDisabled = formData.aptitudeTest === 'NOT_REQUIRED';
  const scorePlaceholder = scoreTypePlaceholders[formData.scoreType] || 'Enter score';

  return (
    <div className={cx('pma-ai-form')}>
      <div className={cx('pma-ai-form-section', 'pma-ai-field-full')}>
        <h3 className={cx('pma-ai-section-heading')}>Program Preferences</h3>
        <p className={cx('pma-ai-section-subtext')}>
          Tell us where and what you want to study.
        </p>
        <div className={cx('pma-ai-section-grid')}>
          <div className={cx('pma-ai-field')}>
            <label>Where do you want to study?</label>
            <select
              value={formData.targetCountry}
              onChange={setField('targetCountry')}
            >
              <option value="">Select country</option>
              {targetCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Degree Level</label>
            <select
              value={formData.degreeLevel}
              onChange={setField('degreeLevel')}
            >
              <option value="">Select degree level</option>
              {degreeLevels.map((degreeLevel) => (
                <option key={degreeLevel} value={degreeLevel}>
                  {degreeLevel}
                </option>
              ))}
            </select>
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Program Area</label>
            <select
              value={formData.programArea}
              onChange={setField('programArea')}
            >
              <option value="">Select area</option>
              {programAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <div className={cx('pma-ai-field', 'pma-ai-field-full')}>
            <label>Specialization (optional)</label>
            <input
              value={formData.fieldOfStudy}
              onChange={setField('fieldOfStudy')}
              placeholder="Example: Business Analytics, VLSI, HCI"
            />
          </div>
        </div>
      </div>

      <div className={cx('pma-ai-form-section', 'pma-ai-field-full')}>
        <h3 className={cx('pma-ai-section-heading')}>Academic Profile</h3>
        <p className={cx('pma-ai-section-subtext')}>
          Use your real score format: Percentage, CGPA, or GPA.
        </p>
        <div className={cx('pma-ai-section-grid')}>
          <div className={cx('pma-ai-field')}>
            <label>Academic Score Type</label>
            <select value={formData.scoreType} onChange={setField('scoreType')}>
              <option value="PERCENTAGE_100">Percentage (100)</option>
              <option value="CGPA_10">CGPA (10)</option>
              <option value="GPA_4">GPA (4)</option>
            </select>
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Academic Score Value</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.scoreValue}
              onChange={setField('scoreValue')}
              placeholder={scorePlaceholder}
            />
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Board / University (optional)</label>
            <input
              value={formData.boardOrUniversity}
              onChange={setField('boardOrUniversity')}
              placeholder="Example: CBSE, VTU, Mumbai University"
            />
          </div>
        </div>
      </div>

      <div className={cx('pma-ai-form-section', 'pma-ai-field-full')}>
        <h3 className={cx('pma-ai-section-heading')}>Test Scores</h3>
        <p className={cx('pma-ai-section-subtext')}>
          If not taken yet, keep test as &quot;Not Taken Yet&quot; or
          &quot;Not Required&quot;.
        </p>
        <div className={cx('pma-ai-section-grid')}>
          <div className={cx('pma-ai-field')}>
            <label>English Test</label>
            <select value={formData.englishTest} onChange={setField('englishTest')}>
              <option value="NOT_TAKEN">Not Taken Yet</option>
              <option value="IELTS">IELTS</option>
              <option value="TOEFL_IBT">TOEFL iBT</option>
              <option value="PTE">PTE</option>
              <option value="DUOLINGO">Duolingo</option>
            </select>
          </div>
          <div className={cx('pma-ai-field')}>
            <label>English Test Score</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.englishScore}
              onChange={setField('englishScore')}
              placeholder="Example: IELTS 7.5"
              disabled={isEnglishScoreDisabled}
            />
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Aptitude Test</label>
            <select value={formData.aptitudeTest} onChange={setField('aptitudeTest')}>
              <option value="NOT_REQUIRED">Not Required</option>
              <option value="GRE">GRE</option>
              <option value="GMAT">GMAT</option>
              <option value="SAT">SAT</option>
              <option value="ACT">ACT</option>
              <option value="GATE">GATE</option>
            </select>
          </div>
          <div className={cx('pma-ai-field')}>
            <label>Aptitude Test Score</label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.aptitudeScore}
              onChange={setField('aptitudeScore')}
              placeholder="Example: GRE 318"
              disabled={isAptitudeScoreDisabled}
            />
          </div>
        </div>
      </div>
      <div className={cx('pma-ai-step-actions')}>
        <button type="button" className={cx('pma-ai-secondary')} onClick={onBack}>
          Back
        </button>
        <button type="button" className={cx('pma-ai-primary')} onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};
export default CourseStep;
