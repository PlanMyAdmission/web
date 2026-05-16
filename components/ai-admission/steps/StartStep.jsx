'use client';

import React from 'react';
import {
  AIToolCard,
  AIToolField,
  AIToolActions,
  inputClass,
} from '@/components/ai-tools/AIToolShell.jsx';

const targetCountries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'Australia',
  'Ireland',
  'Singapore',
  'New Zealand',
];

const degreeLevels = ['UG', 'PG', 'PhD'];

const programAreas = [
  'Computer Science',
  'Business and Management',
  'Engineering',
  'Data Science and AI',
  'Public Health',
  'Finance and Economics',
  'Law',
  'Design and Media',
];

const intakes = ['Fall 2026', 'Spring 2027', 'Fall 2027'];

const StartStep = ({
  mode,
  onModeChange,
  pdfFile,
  onFileChange,
  formData,
  setField,
  onContinue,
  onAnalyze,
}) => (
  <AIToolCard>
    <div className="inline-flex rounded-md border border-[#e8dde3] bg-light p-1">
      <button
        type="button"
        onClick={() => onModeChange('form')}
        className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
          mode === 'form' ? 'bg-white text-[#3f1831] shadow-sm' : 'text-grey'
        }`}
      >
        Answer questions
      </button>
      <button
        type="button"
        onClick={() => onModeChange('pdf')}
        className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
          mode === 'pdf' ? 'bg-white text-[#3f1831] shadow-sm' : 'text-grey'
        }`}
      >
        Upload PDF
      </button>
    </div>

    {mode === 'pdf' ? (
      <div className="mt-6 space-y-4">
        <div className="rounded-md border-2 border-dashed border-[#e8dde3] bg-light p-6 text-center">
          <label className="cursor-pointer block">
            <input
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              className="hidden"
            />
            <p className="text-base font-semibold text-[#3f1831]">
              {pdfFile ? pdfFile.name : 'Click to upload your profile PDF'}
            </p>
            <p className="mt-2 text-sm text-grey">
              Max 25 MB · sent to AI for analysis only
            </p>
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={!pdfFile}
            className={`px-6 py-2.5 rounded-md bg-main text-white font-semibold transition-colors ${
              !pdfFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-main/90'
            }`}
          >
            Analyze profile
          </button>
        </div>
      </div>
    ) : (
      <div className="mt-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-[#3f1831]">
            Where do you want to study?
          </h3>
          <p className="mt-1 text-sm text-grey">
            Destination, degree, program, intake. No name or email needed yet.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AIToolField label="Target country">
            <select
              value={formData.targetCountry}
              onChange={setField('targetCountry')}
              className={inputClass}
            >
              <option value="">Select country</option>
              {targetCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </AIToolField>
          <AIToolField label="Degree level">
            <select
              value={formData.degreeLevel}
              onChange={setField('degreeLevel')}
              className={inputClass}
            >
              <option value="">Select level</option>
              {degreeLevels.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </AIToolField>
          <AIToolField label="Program area">
            <select
              value={formData.programArea}
              onChange={setField('programArea')}
              className={inputClass}
            >
              <option value="">Select area</option>
              {programAreas.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </AIToolField>
          <AIToolField label="Target intake">
            <select
              value={formData.targetIntake}
              onChange={setField('targetIntake')}
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

        <AIToolField label="Specialization (optional)">
          <input
            type="text"
            value={formData.fieldOfStudy}
            onChange={setField('fieldOfStudy')}
            placeholder="e.g. Business Analytics, VLSI, HCI"
            className={inputClass}
          />
        </AIToolField>

        <AIToolActions onNext={onContinue} nextLabel="Continue" />
      </div>
    )}
  </AIToolCard>
);

export default StartStep;
