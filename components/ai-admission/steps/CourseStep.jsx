'use client';

import React from 'react';
import {
  AIToolCard,
  AIToolField,
  AIToolActions,
  inputClass,
} from '@/components/ai-tools/AIToolShell.jsx';

const scorePlaceholders = {
  PERCENTAGE_100: 'e.g. 82',
  CGPA_10: 'e.g. 8.2',
  GPA_4: 'e.g. 3.6',
};

const CourseStep = ({ formData, setField, onBack, onNext }) => {
  const englishDisabled = formData.englishTest === 'NOT_TAKEN';
  const aptitudeDisabled = formData.aptitudeTest === 'NOT_REQUIRED';

  return (
    <AIToolCard>
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold text-[#3f1831]">
            Your academics
          </h3>
          <p className="mt-1 text-sm text-grey">
            Use your real score format — we&apos;ll normalize it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <AIToolField label="Score type">
            <select
              value={formData.scoreType}
              onChange={setField('scoreType')}
              className={inputClass}
            >
              <option value="PERCENTAGE_100">Percentage / 100</option>
              <option value="CGPA_10">CGPA / 10</option>
              <option value="GPA_4">GPA / 4</option>
            </select>
          </AIToolField>
          <AIToolField label="Score value">
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.scoreValue}
              onChange={setField('scoreValue')}
              placeholder={scorePlaceholders[formData.scoreType] || 'Enter score'}
              className={inputClass}
            />
          </AIToolField>
          <AIToolField label="Board / University">
            <input
              type="text"
              value={formData.boardOrUniversity}
              onChange={setField('boardOrUniversity')}
              placeholder="CBSE · VTU · Mumbai Univ"
              className={inputClass}
            />
          </AIToolField>
        </div>

        <div className="border-t border-[#e8dde3] pt-6">
          <h3 className="text-base font-semibold text-[#3f1831]">Test scores</h3>
          <p className="mt-1 text-sm text-grey">
            Leave as &quot;Not taken&quot; if you haven&apos;t yet.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AIToolField label="English test">
            <select
              value={formData.englishTest}
              onChange={setField('englishTest')}
              className={inputClass}
            >
              <option value="NOT_TAKEN">Not taken yet</option>
              <option value="IELTS">IELTS</option>
              <option value="TOEFL_IBT">TOEFL iBT</option>
              <option value="PTE">PTE</option>
              <option value="DUOLINGO">Duolingo</option>
            </select>
          </AIToolField>
          <AIToolField label="English score">
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.englishScore}
              onChange={setField('englishScore')}
              placeholder="e.g. 7.5"
              disabled={englishDisabled}
              className={`${inputClass} ${englishDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </AIToolField>
          <AIToolField label="Aptitude test">
            <select
              value={formData.aptitudeTest}
              onChange={setField('aptitudeTest')}
              className={inputClass}
            >
              <option value="NOT_REQUIRED">Not required</option>
              <option value="GRE">GRE</option>
              <option value="GMAT">GMAT</option>
              <option value="SAT">SAT</option>
              <option value="ACT">ACT</option>
              <option value="GATE">GATE</option>
            </select>
          </AIToolField>
          <AIToolField label="Aptitude score">
            <input
              type="number"
              min="0"
              value={formData.aptitudeScore}
              onChange={setField('aptitudeScore')}
              placeholder="e.g. 318"
              disabled={aptitudeDisabled}
              className={`${inputClass} ${aptitudeDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </AIToolField>
        </div>

        <AIToolActions onBack={onBack} onNext={onNext} />
      </div>
    </AIToolCard>
  );
};

export default CourseStep;
