'use client';

import React from 'react';
import uniStyles from '@/components/ai-university-search/AIUniversitySearch.module.css';
import { STEP_BY_FIELD } from '@/components/ai-university-search/searchProfile.js';
import { steps } from '@/components/ai-university-search/searchHeaderConfig.js';
import BasicsStep from '@/components/ai-university-search/steps/BasicsStep.jsx';
import AcademicsStep from '@/components/ai-university-search/steps/AcademicsStep.jsx';
import PreferencesStep from '@/components/ai-university-search/steps/PreferencesStep.jsx';

const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => uniStyles[name])
    .filter(Boolean)
    .join(' ');

const SearchHeader = ({ searchProfile, onFieldChange, onSearch, onReset, activeStep, onStepChange, validationErrors, isLoading }) => {
  const getError = (field) => validationErrors?.[field] || '';
  const hasStepError = (stepIndex) => Object.keys(validationErrors || {}).some((field) => STEP_BY_FIELD[field] === stepIndex);

  const toggleMultiValue = (field, value, max = Infinity) => {
    const currentValues = Array.isArray(searchProfile[field]) ? searchProfile[field] : [];
    if (currentValues.includes(value)) {
      onFieldChange(field, currentValues.filter((item) => item !== value));
      return;
    }
    if (currentValues.length < max) {
      onFieldChange(field, [...currentValues, value]);
    }
  };

  const renderError = (field) => {
    const errorText = getError(field);
    return errorText ? <p className={cx('pma-uni-field-error')}>{errorText}</p> : null;
  };

  const progressPercent = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className={cx('pma-uni-search-bar')}>
      <div className={cx('pma-uni-search-intro')}>
        <h3>Short 3-step flow</h3>
        <p>Fill basics, academics, and preferences. Generate instantly.</p>
      </div>

      <div className={cx('pma-uni-stepper')}>
        <div className={cx('pma-uni-progress-track')}>
          <div className={cx('pma-uni-progress-fill')} style={{ width: `${progressPercent}%` }} />
        </div>
        <div className={cx('pma-uni-step-row')}>
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              className={cx('pma-uni-step-pill', activeStep === index ? 'active' : '', index < activeStep ? 'complete' : '', hasStepError(index) ? 'error' : '')}
              onClick={() => onStepChange(index)}
            >
              <span>{index + 1}</span>
              {step.title}
            </button>
          ))}
        </div>
      </div>

      {activeStep === 0 && <BasicsStep cx={cx} searchProfile={searchProfile} onFieldChange={onFieldChange} toggleMultiValue={toggleMultiValue} getError={getError} renderError={renderError} />}
      {activeStep === 1 && <AcademicsStep cx={cx} searchProfile={searchProfile} onFieldChange={onFieldChange} getError={getError} renderError={renderError} />}
      {activeStep === 2 && <PreferencesStep cx={cx} searchProfile={searchProfile} onFieldChange={onFieldChange} toggleMultiValue={toggleMultiValue} />}

      <div className={cx('pma-uni-step-actions')}>
        <button type="button" className={cx('pma-uni-secondary')} onClick={onReset}>
          Reset
        </button>
        <div className={cx('pma-uni-step-actions-right')}>
          {activeStep > 0 && (
            <button type="button" className={cx('pma-uni-secondary')} onClick={() => onStepChange(activeStep - 1)}>
              Back
            </button>
          )}
          {activeStep < steps.length - 1 ? (
            <button type="button" className={cx('pma-uni-primary')} onClick={() => onStepChange(activeStep + 1)}>
              Continue
            </button>
          ) : (
            <button type="button" className={cx('pma-uni-primary')} onClick={onSearch} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Matches'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
