'use client';

import React from 'react';
import {
  AIToolField,
  inputClass,
} from '@/components/ai-tools/AIToolShell.jsx';
import {
  englishTests,
  getScorePlaceholder,
  scoreTypes,
} from '@/components/ai-university-search/searchHeaderConfig.js';

const AcademicsStep = ({
  searchProfile,
  onFieldChange,
  getError,
  renderError,
}) => (
  <div className="space-y-5">
    <div>
      <h3 className="text-base font-semibold text-[#3f1831]">
        Academics &amp; budget
      </h3>
      <p className="mt-1 text-sm text-grey">
        Your scores plus an estimated annual budget.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <AIToolField label="Score type" error={getError('scoreType')}>
        <select
          value={searchProfile.scoreType}
          onChange={(event) => onFieldChange('scoreType', event.target.value)}
          className={inputClass}
        >
          <option value="">Select type</option>
          {scoreTypes.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </AIToolField>

      <AIToolField label="Score value" error={getError('scoreValue')}>
        <input
          type="number"
          step="0.1"
          value={searchProfile.scoreValue}
          onChange={(event) => onFieldChange('scoreValue', event.target.value)}
          placeholder={getScorePlaceholder(searchProfile.scoreType)}
          className={inputClass}
        />
      </AIToolField>

      <AIToolField label="Board / University (optional)">
        <input
          type="text"
          value={searchProfile.boardOrUniversity}
          onChange={(event) =>
            onFieldChange('boardOrUniversity', event.target.value)
          }
          placeholder="CBSE · VTU · Mumbai Univ"
          className={inputClass}
        />
      </AIToolField>

      <AIToolField label="English test status">
        <select
          value={searchProfile.englishTestStatus}
          onChange={(event) =>
            onFieldChange('englishTestStatus', event.target.value)
          }
          className={inputClass}
        >
          <option value="">Select status</option>
          <option value="taken">Taken</option>
          <option value="planned">Planned</option>
          <option value="not-yet">Not yet</option>
        </select>
      </AIToolField>

      {searchProfile.englishTestStatus === 'taken' && (
        <>
          <AIToolField label="English test type" error={getError('englishTestType')}>
            <select
              value={searchProfile.englishTestType}
              onChange={(event) =>
                onFieldChange('englishTestType', event.target.value)
              }
              className={inputClass}
            >
              <option value="">Select test</option>
              {englishTests.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </AIToolField>
          <AIToolField label="English score" error={getError('englishTestScore')}>
            <input
              type="number"
              step="0.1"
              value={searchProfile.englishTestScore}
              onChange={(event) =>
                onFieldChange('englishTestScore', event.target.value)
              }
              placeholder="e.g. 7.5"
              className={inputClass}
            />
          </AIToolField>
        </>
      )}
    </div>

    <AIToolField label="Estimated annual budget" error={getError('budgetAmount')}>
      <div className="grid grid-cols-[1fr_120px] gap-2">
        <input
          type="number"
          min="0"
          step="1000"
          value={searchProfile.budgetAmount}
          onChange={(event) => onFieldChange('budgetAmount', event.target.value)}
          placeholder="e.g. 2000000"
          className={inputClass}
        />
        <select
          value={searchProfile.budgetCurrency}
          onChange={(event) =>
            onFieldChange('budgetCurrency', event.target.value)
          }
          className={inputClass}
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>
    </AIToolField>
  </div>
);

export default AcademicsStep;
