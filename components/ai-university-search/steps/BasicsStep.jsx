'use client';

import React from 'react';
import { countries, degreeLevels, programAreas } from '@/components/ai-university-search/searchHeaderConfig.js';

const Label = ({ children }) => <label>{children}</label>;

const BasicsStep = ({ cx, searchProfile, onFieldChange, toggleMultiValue, getError, renderError }) => (
  <div className={cx('pma-uni-search-section')}>
    <h4>Basic profile</h4>
    <div className={cx('pma-uni-search-grid')}>
      <div className={cx('pma-uni-search-field', 'pma-uni-search-field-full')}>
        <Label>Filled By</Label>
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
        <Label>Student Name</Label>
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
        <Label>Study Level</Label>
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
        <Label>Field of Study</Label>
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
        <Label>Preferred Destinations (up to 2)</Label>
        <div className={cx('pma-uni-chip-select-row')}>
          {countries.map((country) => (
            <button
              key={country}
              type="button"
              className={cx(
                'pma-uni-chip-select',
                (searchProfile.targetCountries || []).includes(country) ? 'selected' : '',
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
        <Label>Planned Intake</Label>
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
);

export default BasicsStep;
