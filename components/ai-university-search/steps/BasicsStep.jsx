'use client';

import React from 'react';
import {
  AIToolField,
  AIToolChips,
  inputClass,
} from '@/components/ai-tools/AIToolShell.jsx';
import {
  countries,
  degreeLevels,
  programAreas,
} from '@/components/ai-university-search/searchHeaderConfig.js';

const intakes = ['Fall 2026', 'Spring 2027', 'Fall 2027'];

const BasicsStep = ({
  searchProfile,
  onFieldChange,
  toggleMultiValue,
  getError,
  renderError,
}) => (
  <div className="space-y-5">
    <div>
      <h3 className="text-base font-semibold text-[#3f1831]">Basic profile</h3>
      <p className="mt-1 text-sm text-grey">
        Who&apos;s applying, what they want to study, and where.
      </p>
    </div>

    <AIToolField label="Who's filling this">
      <AIToolChips
        options={[
          { value: 'student', label: 'Student' },
          { value: 'parent', label: 'Parent' },
          { value: 'guardian', label: 'Guardian' },
        ]}
        value={searchProfile.filledBy}
        onChange={(v) => onFieldChange('filledBy', v)}
      />
      {renderError('filledBy')}
    </AIToolField>

    <div className="grid gap-4 sm:grid-cols-2">
      <AIToolField label="Student name" error={getError('studentName')}>
        <input
          type="text"
          value={searchProfile.studentName}
          onChange={(event) => onFieldChange('studentName', event.target.value)}
          placeholder="e.g. Aarav Sharma"
          className={inputClass}
        />
      </AIToolField>

      <AIToolField label="Study level" error={getError('degreeLevel')}>
        <select
          value={searchProfile.degreeLevel}
          onChange={(event) => onFieldChange('degreeLevel', event.target.value)}
          className={inputClass}
        >
          <option value="">Select level</option>
          {degreeLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </AIToolField>

      <AIToolField label="Field of study" error={getError('programArea')}>
        <select
          value={searchProfile.programArea}
          onChange={(event) => onFieldChange('programArea', event.target.value)}
          className={inputClass}
        >
          <option value="">Select field</option>
          {programAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </AIToolField>

      <AIToolField label="Planned intake" error={getError('targetIntake')}>
        <select
          value={searchProfile.targetIntake}
          onChange={(event) => onFieldChange('targetIntake', event.target.value)}
          className={inputClass}
        >
          <option value="">Select intake</option>
          {intakes.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </AIToolField>
    </div>

    <AIToolField label="Preferred destinations (up to 2)">
      <AIToolChips
        options={countries}
        value={searchProfile.targetCountries || []}
        onChange={(next) => onFieldChange('targetCountries', next)}
        multi
        max={2}
      />
      {renderError('targetCountries')}
    </AIToolField>
  </div>
);

export default BasicsStep;
