'use client';

import React from 'react';
import uniStyles from '@/components/ai-university-search/AIUniversitySearch.module.css';

const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => uniStyles[name])
    .filter(Boolean)
    .join(' ');

const steps = [
  {
    id: 'basics',
    title: 'Basics',
  },
  {
    id: 'academics',
    title: 'Academics',
  },
  {
    id: 'preferences',
    title: 'Preferences',
  },
];

const FIELD_TO_STEP = {
  filledBy: 0,
  studentName: 0,
  degreeLevel: 0,
  programArea: 0,
  targetCountries: 0,
  targetIntake: 0,
  scoreType: 1,
  scoreValue: 1,
  englishTestType: 1,
  englishTestScore: 1,
  budgetAmount: 1,
  fundingPlan: 2,
  scholarshipNeed: 2,
  familyPriorityTop3: 2,
  riskComfort: 2,
  contactPreferences: 2,
};

const degreeLevels = [
  {
    value: 'UG',
    label: 'Undergraduate (UG)',
  },
  {
    value: 'PG',
    label: 'Postgraduate (PG)',
  },
  {
    value: 'PhD',
    label: 'Doctorate (PhD)',
  },
];

const programAreas = [
  'Computer Science',
  'Information Technology',
  'Business and Management',
  'Engineering',
  'Data Science and AI',
  'Healthcare and Life Sciences',
  'Public Health',
  'Finance and Economics',
  'Law',
  'Design and Media',
];

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'Australia',
  'Ireland',
  'Netherlands',
  'France',
  'Singapore',
  'New Zealand',
];

const contactOptions = ['WhatsApp', 'Email', 'Call'];

const scoreTypes = [
  {
    value: 'percentage',
    label: 'Percentage (100)',
  },
  {
    value: 'cgpa10',
    label: 'CGPA (10)',
  },
  {
    value: 'gpa4',
    label: 'GPA (4)',
  },
];

const englishTests = ['IELTS', 'TOEFL iBT', 'PTE', 'Duolingo'];

const fundingPlans = ['Self-funded', 'Education loan', 'Scholarship dependent', 'Mixed'];

const scholarshipNeeds = ['Low', 'Medium', 'High'];

const familyPriorities = [
  'Affordability',
  'Safety',
  'Employability',
  'Campus support',
  'Indian community',
  'Distance from home',
];

const riskComfortOptions = ['Conservative', 'Balanced', 'Ambitious'];

const scoreTypeLabels = scoreTypes.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

const getScorePlaceholder = (scoreType) => {
  if (scoreType === 'percentage') return 'Example: 86';
  if (scoreType === 'cgpa10') return 'Example: 8.2';
  return 'Example: 3.4';
};

const SearchHeader = ({
  searchProfile,
  onFieldChange,
  onSearch,
  onReset,
  activeStep,
  onStepChange,
  validationErrors,
  isLoading,
}) => {
  const hasStepError = (stepIndex) =>
    Object.keys(validationErrors || {}).some(
      (field) => FIELD_TO_STEP[field] === stepIndex,
    );

  const getError = (field) => validationErrors?.[field] || '';

  const toggleMultiValue = (field, value, max = Infinity) => {
    const currentValues = Array.isArray(searchProfile[field])
      ? searchProfile[field]
      : [];

    if (currentValues.includes(value)) {
      onFieldChange(
        field,
        currentValues.filter((item) => item !== value),
      );
      return;
    }

    if (currentValues.length >= max) {
      return;
    }

    onFieldChange(field, [...currentValues, value]);
  };

  const renderError = (field) => {
    const errorText = getError(field);
    if (!errorText) return null;
    return <p className={cx('pma-uni-field-error')}>{errorText}</p>;
  };

  const totalSteps = steps.length;
  const progressPercent = ((activeStep + 1) / totalSteps) * 100;

  return (
    <div className={cx('pma-uni-search-bar')}>
      <div className={cx('pma-uni-search-intro')}>
        <h3>Short 3-step flow</h3>
        <p>Fill basics, academics, and preferences. Generate instantly.</p>
      </div>

      <div className={cx('pma-uni-stepper')}>
        <div className={cx('pma-uni-progress-track')}>
          <div
            className={cx('pma-uni-progress-fill')}
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>
        <div className={cx('pma-uni-step-row')}>
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              className={cx(
                'pma-uni-step-pill',
                activeStep === index ? 'active' : '',
                index < activeStep ? 'complete' : '',
                hasStepError(index) ? 'error' : '',
              )}
              onClick={() => onStepChange(index)}
            >
              <span>{index + 1}</span>
              {step.title}
            </button>
          ))}
        </div>
      </div>

      {activeStep === 0 && (
        <div className={cx('pma-uni-search-section')}>
          <h4>Basic profile</h4>

          <div className={cx('pma-uni-search-grid')}>
            <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
              <label>Filled By</label>
              <div className={cx('pma-uni-chip-select-row')}>
                {['student', 'parent', 'guardian'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={cx(
                      'pma-uni-chip-select',
                      searchProfile.filledBy === option ? 'selected' : '',
                      getError('filledBy') ? 'input-error' : '',
                    )}
                    onClick={() => onFieldChange('filledBy', option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
              {renderError('filledBy')}
            </div>

            <div className={cx('pma-uni-search-field')}>
              <label>Student Name</label>
              <input
                type="text"
                className={cx(getError('studentName') ? 'pma-uni-input-error' : '')}
                placeholder="Example: Aarav Sharma"
                value={searchProfile.studentName}
                onChange={(event) => onFieldChange('studentName', event.target.value)}
              />
              {renderError('studentName')}
            </div>

            <div className={cx('pma-uni-search-field')}>
              <label>Study Level</label>
              <select
                className={cx(getError('degreeLevel') ? 'pma-uni-input-error' : '')}
                value={searchProfile.degreeLevel}
                onChange={(event) => onFieldChange('degreeLevel', event.target.value)}
              >
                <option value="">Select study level</option>
                {degreeLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {renderError('degreeLevel')}
            </div>

            <div className={cx('pma-uni-search-field')}>
              <label>Field of Study</label>
              <select
                className={cx(getError('programArea') ? 'pma-uni-input-error' : '')}
                value={searchProfile.programArea}
                onChange={(event) => onFieldChange('programArea', event.target.value)}
              >
                <option value="">Select field</option>
                {programAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              {renderError('programArea')}
            </div>

            <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
              <label>Preferred Destinations (up to 2)</label>
              <div className={cx('pma-uni-chip-select-row')}>
                {countries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    className={cx(
                      'pma-uni-chip-select',
                      (searchProfile.targetCountries || []).includes(country)
                        ? 'selected'
                        : '',
                      getError('targetCountries') ? 'input-error' : '',
                    )}
                    onClick={() => toggleMultiValue('targetCountries', country, 2)}
                  >
                    {country}
                  </button>
                ))}
              </div>
              {renderError('targetCountries')}
            </div>

            <div className={cx('pma-uni-search-field')}>
              <label>Planned Intake</label>
              <select
                className={cx(getError('targetIntake') ? 'pma-uni-input-error' : '')}
                value={searchProfile.targetIntake}
                onChange={(event) => onFieldChange('targetIntake', event.target.value)}
              >
                <option value="">Select intake</option>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
                <option value="Fall 2027">Fall 2027</option>
              </select>
              {renderError('targetIntake')}
            </div>
          </div>
        </div>
      )}

      {activeStep === 1 && (
        <div className={cx('pma-uni-search-section')}>
          <h4>Academics and budget</h4>

          <div className={cx('pma-uni-search-grid')}>
            <div className={cx('pma-uni-search-field')}>
              <label>Academic Score Type</label>
              <select
                className={cx(getError('scoreType') ? 'pma-uni-input-error' : '')}
                value={searchProfile.scoreType}
                onChange={(event) => onFieldChange('scoreType', event.target.value)}
              >
                <option value="">Select score type</option>
                {scoreTypes.map((scoreType) => (
                  <option key={scoreType.value} value={scoreType.value}>
                    {scoreType.label}
                  </option>
                ))}
              </select>
              {renderError('scoreType')}
            </div>

            <div className={cx('pma-uni-search-field')}>
              <label>Academic Score Value</label>
              <input
                type="number"
                step="0.1"
                className={cx(getError('scoreValue') ? 'pma-uni-input-error' : '')}
                placeholder={getScorePlaceholder(searchProfile.scoreType)}
                value={searchProfile.scoreValue}
                onChange={(event) => onFieldChange('scoreValue', event.target.value)}
              />
              {renderError('scoreValue')}
            </div>

            <div className={cx('pma-uni-search-field')}>
              <label>Board or University (optional)</label>
              <input
                type="text"
                placeholder="Example: CBSE, VTU, Mumbai University"
                value={searchProfile.boardOrUniversity}
                onChange={(event) => onFieldChange('boardOrUniversity', event.target.value)}
              />
            </div>

            <div className={cx('pma-uni-search-field')}>
              <label>English Test Status (optional)</label>
              <select
                value={searchProfile.englishTestStatus}
                onChange={(event) => onFieldChange('englishTestStatus', event.target.value)}
              >
                <option value="">Select status</option>
                <option value="taken">Taken</option>
                <option value="planned">Planned</option>
                <option value="not-yet">Not yet</option>
              </select>
            </div>

            {searchProfile.englishTestStatus === 'taken' && (
              <>
                <div className={cx('pma-uni-search-field')}>
                  <label>English Test Type</label>
                  <select
                    className={cx(getError('englishTestType') ? 'pma-uni-input-error' : '')}
                    value={searchProfile.englishTestType}
                    onChange={(event) =>
                      onFieldChange('englishTestType', event.target.value)
                    }
                  >
                    <option value="">Select test</option>
                    {englishTests.map((test) => (
                      <option key={test} value={test}>
                        {test}
                      </option>
                    ))}
                  </select>
                  {renderError('englishTestType')}
                </div>

                <div className={cx('pma-uni-search-field')}>
                  <label>English Test Score</label>
                  <input
                    type="number"
                    step="0.1"
                    className={cx(getError('englishTestScore') ? 'pma-uni-input-error' : '')}
                    placeholder="Example: 7.5"
                    value={searchProfile.englishTestScore}
                    onChange={(event) =>
                      onFieldChange('englishTestScore', event.target.value)
                    }
                  />
                  {renderError('englishTestScore')}
                </div>
              </>
            )}

            <div className={cx('pma-uni-search-field')}>
              <label>Estimated Annual Budget</label>
              <div className={cx('pma-uni-budget-row')}>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className={cx(getError('budgetAmount') ? 'pma-uni-input-error' : '')}
                  placeholder="Example: 20,00,000"
                  value={searchProfile.budgetAmount}
                  onChange={(event) => onFieldChange('budgetAmount', event.target.value)}
                />
                <select
                  value={searchProfile.budgetCurrency}
                  onChange={(event) => onFieldChange('budgetCurrency', event.target.value)}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              {renderError('budgetAmount')}
            </div>
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div className={cx('pma-uni-search-section')}>
          <h4>Preferences (all optional)</h4>

          <div className={cx('pma-uni-search-grid')}>
            <div className={cx('pma-uni-search-field')}>
              <label>Funding Plan</label>
              <select
                value={searchProfile.fundingPlan}
                onChange={(event) => onFieldChange('fundingPlan', event.target.value)}
              >
                <option value="">Select funding plan</option>
                {fundingPlans.map((fundingPlan) => (
                  <option key={fundingPlan} value={fundingPlan}>
                    {fundingPlan}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx('pma-uni-search-field')}>
              <label>Scholarship Need</label>
              <select
                value={searchProfile.scholarshipNeed}
                onChange={(event) => onFieldChange('scholarshipNeed', event.target.value)}
              >
                <option value="">Select level</option>
                {scholarshipNeeds.map((need) => (
                  <option key={need} value={need}>
                    {need}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
              <label>Top Family Priorities (up to 2)</label>
              <div className={cx('pma-uni-chip-select-row')}>
                {familyPriorities.map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    className={cx(
                      'pma-uni-chip-select',
                      (searchProfile.familyPriorityTop3 || []).includes(priority)
                        ? 'selected'
                        : '',
                    )}
                    onClick={() => toggleMultiValue('familyPriorityTop3', priority, 2)}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
              <label>Risk Comfort</label>
              <div className={cx('pma-uni-chip-select-row')}>
                {riskComfortOptions.map((riskOption) => (
                  <button
                    key={riskOption}
                    type="button"
                    className={cx(
                      'pma-uni-chip-select',
                      searchProfile.riskComfort === riskOption ? 'selected' : '',
                    )}
                    onClick={() => onFieldChange('riskComfort', riskOption)}
                  >
                    {riskOption}
                  </button>
                ))}
              </div>
            </div>

            <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
              <label>Preferred Contact Channel</label>
              <div className={cx('pma-uni-chip-select-row')}>
                {contactOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={cx(
                      'pma-uni-chip-select',
                      (searchProfile.contactPreferences || []).includes(option)
                        ? 'selected'
                        : '',
                    )}
                    onClick={() => toggleMultiValue('contactPreferences', option, 3)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className={cx('pma-uni-search-field')}>
              <label>Specialization (optional)</label>
              <input
                type="text"
                placeholder="Example: Data Engineering"
                value={searchProfile.specialization}
                onChange={(event) => onFieldChange('specialization', event.target.value)}
              />
            </div>

            <div className={cx('pma-uni-search-field')}>
              <label>Career Goal (optional)</label>
              <input
                type="text"
                placeholder="Example: AI product roles"
                value={searchProfile.careerGoal}
                onChange={(event) => onFieldChange('careerGoal', event.target.value)}
              />
            </div>

            <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
              <label>Additional Notes (optional)</label>
              <input
                type="text"
                placeholder="Example: prefers safer cities and internships"
                value={searchProfile.query}
                onChange={(event) => onFieldChange('query', event.target.value)}
              />
            </div>

            <div className={cx('pma-uni-review-grid', 'pma-uni-search-field-full')}>
              <div>
                <span>Profile</span>
                <p>{searchProfile.filledBy || 'Not set'}</p>
              </div>
              <div>
                <span>Study Goal</span>
                <p>
                  {[searchProfile.degreeLevel, searchProfile.programArea]
                    .filter(Boolean)
                    .join(' · ') || 'Not set'}
                </p>
              </div>
              <div>
                <span>Academic Score</span>
                <p>
                  {searchProfile.scoreType && searchProfile.scoreValue
                    ? `${scoreTypeLabels[searchProfile.scoreType] || searchProfile.scoreType}: ${searchProfile.scoreValue}`
                    : 'Not set'}
                </p>
              </div>
              <div>
                <span>Budget</span>
                <p>
                  {searchProfile.budgetAmount
                    ? `${searchProfile.budgetAmount} ${searchProfile.budgetCurrency}`
                    : 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={cx('pma-uni-step-actions')}>
        <button type="button" className={cx('pma-uni-secondary')} onClick={onReset}>
          Reset
        </button>

        <div className={cx('pma-uni-step-actions-right')}>
          {activeStep > 0 && (
            <button
              type="button"
              className={cx('pma-uni-secondary')}
              onClick={() => onStepChange(activeStep - 1)}
            >
              Back
            </button>
          )}

          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              className={cx('pma-uni-primary')}
              onClick={() => onStepChange(activeStep + 1)}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              className={cx('pma-uni-primary')}
              onClick={onSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Matches'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
