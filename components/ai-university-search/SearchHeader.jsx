'use client';

import React from 'react';
import { STEP_BY_FIELD } from '@/components/ai-university-search/searchProfile.js';
import { steps } from '@/components/ai-university-search/searchHeaderConfig.js';
import BasicsStep from '@/components/ai-university-search/steps/BasicsStep.jsx';
import AcademicsStep from '@/components/ai-university-search/steps/AcademicsStep.jsx';
import PreferencesStep from '@/components/ai-university-search/steps/PreferencesStep.jsx';
import { AIToolCard } from '@/components/ai-tools/AIToolShell.jsx';

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
  const getError = (field) => validationErrors?.[field] || '';
  const hasStepError = (stepIndex) =>
    Object.keys(validationErrors || {}).some(
      (field) => STEP_BY_FIELD[field] === stepIndex,
    );

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
    if (currentValues.length < max) {
      onFieldChange(field, [...currentValues, value]);
    }
  };

  const renderError = (field) => {
    const errorText = getError(field);
    return errorText ? (
      <p className="text-xs text-red-500 mt-1">{errorText}</p>
    ) : null;
  };

  return (
    <AIToolCard>
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {steps.map((step, index) => {
          const active = activeStep === index;
          const complete = index < activeStep;
          const errored = hasStepError(index);
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepChange(index)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                active
                  ? 'bg-main text-white'
                  : complete
                    ? 'bg-light text-[#3f1831]'
                    : 'text-grey hover:bg-light'
              } ${errored ? 'ring-2 ring-red-300' : ''}`}
            >
              <span
                className={`inline-flex w-5 h-5 rounded-full text-xs items-center justify-center font-bold ${
                  active
                    ? 'bg-white text-main'
                    : complete
                      ? 'bg-main text-white'
                      : 'bg-white border border-[#e8dde3] text-grey'
                }`}
              >
                {index + 1}
              </span>
              {step.title}
            </button>
          );
        })}
      </div>

      <div className="space-y-5">
        {activeStep === 0 && (
          <BasicsStep
            searchProfile={searchProfile}
            onFieldChange={onFieldChange}
            toggleMultiValue={toggleMultiValue}
            getError={getError}
            renderError={renderError}
          />
        )}
        {activeStep === 1 && (
          <AcademicsStep
            searchProfile={searchProfile}
            onFieldChange={onFieldChange}
            getError={getError}
            renderError={renderError}
          />
        )}
        {activeStep === 2 && (
          <PreferencesStep
            searchProfile={searchProfile}
            onFieldChange={onFieldChange}
            toggleMultiValue={toggleMultiValue}
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-[#e8dde3]">
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-grey hover:text-[#3f1831] transition-colors"
        >
          Reset
        </button>
        <div className="flex gap-2">
          {activeStep > 0 && (
            <button
              type="button"
              onClick={() => onStepChange(activeStep - 1)}
              className="px-4 py-2.5 rounded-md border border-[#e8dde3] text-[#3f1831] hover:bg-light transition-colors"
            >
              Back
            </button>
          )}
          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => onStepChange(activeStep + 1)}
              className="px-6 py-2.5 rounded-md bg-main text-white font-semibold hover:bg-main/90 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={onSearch}
              disabled={isLoading}
              className={`px-6 py-2.5 rounded-md bg-main text-white font-semibold transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-main/90'
              }`}
            >
              {isLoading ? 'Generating…' : 'Generate matches'}
            </button>
          )}
        </div>
      </div>
    </AIToolCard>
  );
};

export default SearchHeader;
