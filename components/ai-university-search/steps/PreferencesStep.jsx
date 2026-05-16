'use client';

import React from 'react';
import {
  AIToolField,
  AIToolChips,
  inputClass,
} from '@/components/ai-tools/AIToolShell.jsx';
import {
  contactOptions,
  familyPriorities,
  fundingPlans,
  riskComfortOptions,
  scholarshipNeeds,
} from '@/components/ai-university-search/searchHeaderConfig.js';

const PreferencesStep = ({ searchProfile, onFieldChange, toggleMultiValue }) => (
  <div className="space-y-5">
    <div>
      <h3 className="text-base font-semibold text-[#3f1831]">
        Preferences <span className="text-grey font-normal">(all optional)</span>
      </h3>
      <p className="mt-1 text-sm text-grey">
        Tells the AI what your family cares about most.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <AIToolField label="Funding plan">
        <select
          value={searchProfile.fundingPlan}
          onChange={(event) => onFieldChange('fundingPlan', event.target.value)}
          className={inputClass}
        >
          <option value="">Select plan</option>
          {fundingPlans.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </AIToolField>
      <AIToolField label="Scholarship need">
        <select
          value={searchProfile.scholarshipNeed}
          onChange={(event) =>
            onFieldChange('scholarshipNeed', event.target.value)
          }
          className={inputClass}
        >
          <option value="">Select level</option>
          {scholarshipNeeds.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </AIToolField>
    </div>

    <AIToolField label="Top family priorities (up to 2)">
      <AIToolChips
        options={familyPriorities}
        value={searchProfile.familyPriorityTop3 || []}
        onChange={(next) => onFieldChange('familyPriorityTop3', next)}
        multi
        max={2}
      />
    </AIToolField>

    <AIToolField label="Risk comfort">
      <AIToolChips
        options={riskComfortOptions}
        value={searchProfile.riskComfort}
        onChange={(v) => onFieldChange('riskComfort', v)}
      />
    </AIToolField>

    <AIToolField label="Preferred contact channels (up to 3)">
      <AIToolChips
        options={contactOptions}
        value={searchProfile.contactPreferences || []}
        onChange={(next) => onFieldChange('contactPreferences', next)}
        multi
        max={3}
      />
    </AIToolField>

    <div className="grid gap-4 sm:grid-cols-2">
      <AIToolField label="Specialization">
        <input
          type="text"
          value={searchProfile.specialization}
          onChange={(event) =>
            onFieldChange('specialization', event.target.value)
          }
          placeholder="e.g. Data Engineering"
          className={inputClass}
        />
      </AIToolField>
      <AIToolField label="Career goal">
        <input
          type="text"
          value={searchProfile.careerGoal}
          onChange={(event) => onFieldChange('careerGoal', event.target.value)}
          placeholder="e.g. AI product roles"
          className={inputClass}
        />
      </AIToolField>
    </div>

    <AIToolField label="Additional notes">
      <input
        type="text"
        value={searchProfile.query}
        onChange={(event) => onFieldChange('query', event.target.value)}
        placeholder="Anything else we should know"
        className={inputClass}
      />
    </AIToolField>
  </div>
);

export default PreferencesStep;
