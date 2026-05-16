'use client';

import React from 'react';
import {
  AIToolCard,
  AIToolField,
  AIToolActions,
  AIToolChips,
  inputClass,
} from '@/components/ai-tools/AIToolShell.jsx';

const INR_BUCKETS = [
  { value: 'under_15L', label: '< ₹15L/yr' },
  { value: '15L_25L', label: '₹15-25L/yr' },
  { value: '25L_40L', label: '₹25-40L/yr' },
  { value: 'above_40L', label: '> ₹40L/yr' },
];

const USD_BUCKETS = [
  { value: 'under_25k', label: '< $25k/yr' },
  { value: '25k_45k', label: '$25-45k/yr' },
  { value: '45k_70k', label: '$45-70k/yr' },
  { value: 'above_70k', label: '> $70k/yr' },
];

const ExtrasStep = ({ formData, setField, onBack, onSubmit }) => {
  const buckets = formData.budgetCurrency === 'USD' ? USD_BUCKETS : INR_BUCKETS;

  return (
    <AIToolCard>
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold text-[#3f1831]">
            Budget &amp; plans
          </h3>
          <p className="mt-1 text-sm text-grey">
            Pick the closest budget bucket. INR works best from India.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AIToolField label="Currency">
            <select
              value={formData.budgetCurrency}
              onChange={setField('budgetCurrency')}
              className={inputClass}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </AIToolField>
          <AIToolField label="Budget covers">
            <select
              value={formData.budgetIncludes}
              onChange={setField('budgetIncludes')}
              className={inputClass}
            >
              <option value="tuition_living">Tuition + Living</option>
              <option value="tuition_only">Tuition only</option>
            </select>
          </AIToolField>
        </div>

        <AIToolField label="Annual budget bucket">
          <AIToolChips
            options={buckets}
            value={formData.budgetBucket}
            onChange={(v) => setField('budgetBucket')({ target: { value: v } })}
          />
        </AIToolField>

        <div className="grid gap-4 sm:grid-cols-2">
          <AIToolField label="Funding plan">
            <select
              value={formData.fundingPlan}
              onChange={setField('fundingPlan')}
              className={inputClass}
            >
              <option value="">Select plan</option>
              <option value="Self-funded">Self-funded</option>
              <option value="Education loan">Education loan</option>
              <option value="Scholarship dependent">Scholarship dependent</option>
            </select>
          </AIToolField>
          <AIToolField label="Application stage">
            <select
              value={formData.applicationStage}
              onChange={setField('applicationStage')}
              className={inputClass}
            >
              <option value="">Select stage</option>
              <option value="Shortlisting">Shortlisting</option>
              <option value="Preparing exams">Preparing exams</option>
              <option value="Applying">Applying</option>
              <option value="Awaiting admits">Awaiting admits</option>
            </select>
          </AIToolField>
        </div>

        <div className="border-t border-[#e8dde3] pt-6">
          <h3 className="text-base font-semibold text-[#3f1831]">
            Experience <span className="text-grey font-normal">(optional)</span>
          </h3>
          <p className="mt-1 text-sm text-grey">
            Adds nuance to the report. Skip if not relevant.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AIToolField label="Work experience (months)">
            <input
              type="number"
              min="0"
              value={formData.workExperienceMonths}
              onChange={setField('workExperienceMonths')}
              placeholder="e.g. 18"
              className={inputClass}
            />
          </AIToolField>
          <AIToolField label="Highlights">
            <input
              type="text"
              value={formData.workExperience}
              onChange={setField('workExperience')}
              placeholder="Role, impact, projects"
              className={inputClass}
            />
          </AIToolField>
        </div>

        <AIToolField label="Extracurriculars / notes">
          <textarea
            rows={3}
            value={formData.extracurriculars}
            onChange={setField('extracurriculars')}
            placeholder="Clubs, leadership, achievements, any preferences"
            className={inputClass}
          />
        </AIToolField>

        <AIToolActions
          onBack={onBack}
          onNext={onSubmit}
          nextLabel="Generate my report"
        />
      </div>
    </AIToolCard>
  );
};

export default ExtrasStep;
