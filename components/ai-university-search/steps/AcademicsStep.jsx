'use client';

import React from 'react';
import { englishTests, getScorePlaceholder, scoreTypes } from '@/components/ai-university-search/searchHeaderConfig.js';

const Label = ({ children }) => <label>{children}</label>;

const AcademicsStep = ({ cx, searchProfile, onFieldChange, getError, renderError }) => (
  <div className={cx('pma-uni-search-section')}>
    <h4>Academics and budget</h4>
    <div className={cx('pma-uni-search-grid')}>
      <div className={cx('pma-uni-search-field')}>
        <Label>Academic Score Type</Label>
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
        <Label>Academic Score Value</Label>
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
        <Label>Board or University (optional)</Label>
        <input
          type="text"
          placeholder="Example: CBSE, VTU, Mumbai University"
          value={searchProfile.boardOrUniversity}
          onChange={(event) => onFieldChange('boardOrUniversity', event.target.value)}
        />
      </div>

      <div className={cx('pma-uni-search-field')}>
        <Label>English Test Status (optional)</Label>
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
            <Label>English Test Type</Label>
            <select
              className={cx(getError('englishTestType') ? 'pma-uni-input-error' : '')}
              value={searchProfile.englishTestType}
              onChange={(event) => onFieldChange('englishTestType', event.target.value)}
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
            <Label>English Test Score</Label>
            <input
              type="number"
              step="0.1"
              className={cx(getError('englishTestScore') ? 'pma-uni-input-error' : '')}
              placeholder="Example: 7.5"
              value={searchProfile.englishTestScore}
              onChange={(event) => onFieldChange('englishTestScore', event.target.value)}
            />
            {renderError('englishTestScore')}
          </div>
        </>
      )}

      <div className={cx('pma-uni-search-field')}>
        <Label>Estimated Annual Budget</Label>
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
);

export default AcademicsStep;
