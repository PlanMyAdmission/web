'use client';

import React from 'react';
import {
  contactOptions,
  familyPriorities,
  fundingPlans,
  riskComfortOptions,
  scholarshipNeeds,
  scoreTypeLabels,
} from '@/components/ai-university-search/searchHeaderConfig.js';

const Label = ({ children }) => <label>{children}</label>;

const PreferencesStep = ({ cx, searchProfile, onFieldChange, toggleMultiValue }) => (
  <div className={cx('pma-uni-search-section')}>
    <h4>Preferences (all optional)</h4>
    <div className={cx('pma-uni-search-grid')}>
      <div className={cx('pma-uni-search-field')}>
        <Label>Funding Plan</Label>
        <select value={searchProfile.fundingPlan} onChange={(event) => onFieldChange('fundingPlan', event.target.value)}>
          <option value="">Select funding plan</option>
          {fundingPlans.map((fundingPlan) => (
            <option key={fundingPlan} value={fundingPlan}>
              {fundingPlan}
            </option>
          ))}
        </select>
      </div>

      <div className={cx('pma-uni-search-field')}>
        <Label>Scholarship Need</Label>
        <select value={searchProfile.scholarshipNeed} onChange={(event) => onFieldChange('scholarshipNeed', event.target.value)}>
          <option value="">Select level</option>
          {scholarshipNeeds.map((need) => (
            <option key={need} value={need}>
              {need}
            </option>
          ))}
        </select>
      </div>

      <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
        <Label>Top Family Priorities (up to 2)</Label>
        <div className={cx('pma-uni-chip-select-row')}>
          {familyPriorities.map((priority) => (
            <button
              key={priority}
              type="button"
              className={cx(
                'pma-uni-chip-select',
                (searchProfile.familyPriorityTop3 || []).includes(priority) ? 'selected' : '',
              )}
              onClick={() => toggleMultiValue('familyPriorityTop3', priority, 2)}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
        <Label>Risk Comfort</Label>
        <div className={cx('pma-uni-chip-select-row')}>
          {riskComfortOptions.map((riskOption) => (
            <button
              key={riskOption}
              type="button"
              className={cx('pma-uni-chip-select', searchProfile.riskComfort === riskOption ? 'selected' : '')}
              onClick={() => onFieldChange('riskComfort', riskOption)}
            >
              {riskOption}
            </button>
          ))}
        </div>
      </div>

      <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
        <Label>Preferred Contact Channel</Label>
        <div className={cx('pma-uni-chip-select-row')}>
          {contactOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={cx(
                'pma-uni-chip-select',
                (searchProfile.contactPreferences || []).includes(option) ? 'selected' : '',
              )}
              onClick={() => toggleMultiValue('contactPreferences', option, 3)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className={cx('pma-uni-search-field')}>
        <Label>Specialization (optional)</Label>
        <input
          type="text"
          placeholder="Example: Data Engineering"
          value={searchProfile.specialization}
          onChange={(event) => onFieldChange('specialization', event.target.value)}
        />
      </div>

      <div className={cx('pma-uni-search-field')}>
        <Label>Career Goal (optional)</Label>
        <input
          type="text"
          placeholder="Example: AI product roles"
          value={searchProfile.careerGoal}
          onChange={(event) => onFieldChange('careerGoal', event.target.value)}
        />
      </div>

      <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
        <Label>Additional Notes (optional)</Label>
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
          <p>{[searchProfile.degreeLevel, searchProfile.programArea].filter(Boolean).join(' · ') || 'Not set'}</p>
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
          <p>{searchProfile.budgetAmount ? `${searchProfile.budgetAmount} ${searchProfile.budgetCurrency}` : 'Not set'}</p>
        </div>
      </div>
    </div>
  </div>
);

export default PreferencesStep;
