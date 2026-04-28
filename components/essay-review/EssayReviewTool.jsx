'use client';

import { useState } from 'react';
import ReviewResults from '@/components/essay-review/ReviewResults.jsx';
import {
  DOCUMENT_TYPE_OPTIONS,
  REVIEW_FOCUS_OPTIONS,
  INITIAL_REVIEW_FORM,
  getDraftWordCount,
  validateReviewForm,
} from '@/components/essay-review/lib/reviewForm.js';
import { trackAiToolEvent } from '@/lib/analytics.js';
import { fileToBase64 } from '@/lib/clientUtils.js';

const inputClassName =
  'w-full rounded-[22px] border border-[#ddcfda] bg-white px-4 py-3 text-sm text-[#341338] shadow-[0_10px_30px_rgba(58,23,52,0.05)] outline-none transition placeholder:text-[#9a8a9d] focus:border-[#f40076] focus:ring-4 focus:ring-[#f9dbe8]';

const statusClassNames = {
  success: 'border-[#b7ead2] bg-[#eefcf4] text-[#166534]',
  error: 'border-[#f3c8c8] bg-[#fff1f1] text-[#b42318]',
  loading: 'border-[#f7d6e6] bg-[#fff6fb] text-[#8a2460]',
};

const FieldError = ({ message }) =>
  message ? (
    <p className="mt-2 text-xs font-medium text-[#b42318]">{message}</p>
  ) : null;

const TextInput = ({ label, error, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-[#4e3852]">
      {label}
    </span>
    <input className={inputClassName} {...props} />
    <FieldError message={error} />
  </label>
);

const TextArea = ({ label, error, rows = 4, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-[#4e3852]">
      {label}
    </span>
    <textarea className={inputClassName} rows={rows} {...props} />
    <FieldError message={error} />
  </label>
);

export default function EssayReviewTool() {
  const [pdfFile, setPdfFile] = useState(null);
  const [results, setResults] = useState(null);
  const [reviewForm, setReviewForm] = useState(INITIAL_REVIEW_FORM);
  const [validationErrors, setValidationErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  const draftWordCount = getDraftWordCount(reviewForm.essayText);
  const targetWordLimit = Number(reviewForm.wordLimit || 0);
  const wordDelta = targetWordLimit ? draftWordCount - targetWordLimit : 0;

  const setField = (field, value) => {
    setReviewForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setValidationErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const toggleFocusArea = (value) => {
    setReviewForm((previous) => {
      const active = previous.focusAreas || [];
      const nextFocusAreas = active.includes(value)
        ? active.filter((item) => item !== value)
        : active.length >= 3
          ? [...active.slice(1), value]
          : [...active, value];

      return {
        ...previous,
        focusAreas: nextFocusAreas,
      };
    });

    setValidationErrors((previous) => {
      const next = { ...previous };
      delete next.focusAreas;
      return next;
    });
  };

  const resetAll = () => {
    trackAiToolEvent({
      toolName: 'essay_reviewer',
      action: 'reset',
      status: 'completed',
      mode: pdfFile ? 'pdf' : 'text',
      hasPdf: Boolean(pdfFile),
    });
    setPdfFile(null);
    setResults(null);
    setReviewForm(INITIAL_REVIEW_FORM);
    setValidationErrors({});
    setStatus({ type: 'idle', message: '' });
    setFormStartedAt(Date.now());
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPdfFile(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      trackAiToolEvent({
        toolName: 'essay_reviewer',
        action: 'upload_pdf',
        status: 'invalid_file_type',
      });
      setStatus({ type: 'error', message: 'Only PDF uploads are supported.' });
      return;
    }

    setPdfFile(file);
    setStatus({ type: 'idle', message: '' });
    trackAiToolEvent({
      toolName: 'essay_reviewer',
      action: 'upload_pdf',
      status: 'selected',
      hasPdf: true,
    });
  };

  const reviewEssay = async () => {
    const nextErrors = validateReviewForm(reviewForm, {
      hasPdf: Boolean(pdfFile),
    });

    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors);
      setStatus({
        type: 'error',
        message: 'Add the missing details before generating the review.',
      });
      trackAiToolEvent({
        toolName: 'essay_reviewer',
        action: 'generate',
        status: 'validation_failed',
        mode: pdfFile ? 'pdf' : 'text',
        hasPdf: Boolean(pdfFile),
      });
      return;
    }

    if (Date.now() - formStartedAt < 1000) {
      setStatus({
        type: 'error',
        message: 'Give the draft a quick review, then submit again.',
      });
      return;
    }

    setResults(null);
    setValidationErrors({});
    setStatus({
      type: 'loading',
      message: 'Scoring the draft and preparing revision guidance...',
    });
    trackAiToolEvent({
      toolName: 'essay_reviewer',
      action: 'generate',
      status: 'started',
      mode: pdfFile ? 'pdf' : 'text',
      hasPdf: Boolean(pdfFile),
    });

    try {
      const response = await fetch('/api/ai/essay-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewForm,
          pdfBase64: pdfFile ? await fileToBase64(pdfFile) : '',
          pdfMimeType: pdfFile?.type || '',
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload?.error || 'Unable to review the draft right now.',
        );
      }

      if (!payload?.data) {
        throw new Error('The AI review came back empty. Please try again.');
      }

      setResults(payload.data);
      setStatus({
        type: 'success',
        message: 'Your essay review is ready.',
      });
      trackAiToolEvent({
        toolName: 'essay_reviewer',
        action: 'generate',
        status: 'success',
        mode: pdfFile ? 'pdf' : 'text',
        hasPdf: Boolean(pdfFile),
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error?.message ||
          'Something went wrong while generating the essay review.',
      });
      trackAiToolEvent({
        toolName: 'essay_reviewer',
        action: 'generate',
        status: 'error',
        mode: pdfFile ? 'pdf' : 'text',
        hasPdf: Boolean(pdfFile),
      });
    }
  };

  return (
    <div className="bg-[linear-gradient(180deg,#fffdfd_0%,#fff7fb_32%,#ffffff_100%)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,rgba(244,0,118,0.18),transparent_50%),radial-gradient(circle_at_top_right,rgba(89,33,90,0.2),transparent_36%),linear-gradient(180deg,#fff7fb_0%,rgba(255,255,255,0)_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-[36px] border border-white/70 bg-white/75 p-7 shadow-[0_28px_90px_rgba(58,23,52,0.09)] backdrop-blur md:p-8">
              <div className="inline-flex rounded-full bg-[#fff0f6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-[#b4236d]">
                New AI writing tool
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-[#341338] md:text-6xl">
                Rate your SOP or college essay before it reaches admissions.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#5f4a63] md:text-lg">
                Paste your draft or upload a PDF to get a detailed
                admissions-style score, revision priorities, and stronger sample
                lines in one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  'SOPs and personal statements',
                  'Supplemental essay scoring',
                  'Line edits and revised excerpt',
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#f4dce8] bg-white px-4 py-2 text-sm font-medium text-[#7d637f]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[36px] bg-[#311334] p-6 text-white shadow-[0_32px_100px_rgba(49,19,52,0.24)]">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#f0b7d4]">
                Review engine
              </p>
              <div className="mt-5 space-y-4">
                {[
                  {
                    value: '6',
                    label: 'Rubric dimensions',
                  },
                  {
                    value: '3',
                    label: 'Before/after line edits',
                  },
                  {
                    value: '1',
                    label: 'Submission-ready action plan',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.08)] px-4 py-4"
                  >
                    <p className="text-3xl font-semibold tracking-[-0.04em]">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-[#f5dbe8]">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-[#f5dbe8]">
                Best for first-pass scoring, draft polishing, and checking
                whether your story feels distinctive enough for competitive
                applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6 md:pb-[4.5rem]">
        {status.message && status.type !== 'idle' && (
          <div
            className={`mb-6 rounded-[24px] border px-5 py-4 text-sm font-medium ${statusClassNames[status.type]}`}
          >
            {status.message}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="rounded-[32px] border border-[#eadde4] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_70px_rgba(58,23,52,0.08)] backdrop-blur md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a879d]">
                  Submission form
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#341338]">
                  Build the review context
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-[#eadde4] px-4 py-2 text-sm font-semibold text-[#6a576d] transition hover:border-[#d8c6d1] hover:bg-[#faf5f8]"
                onClick={resetAll}
              >
                Reset
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-[#4e3852]">
                Document type
              </p>
              <div className="mt-3 grid gap-3">
                {DOCUMENT_TYPE_OPTIONS.map((item) => {
                  const isActive = reviewForm.documentType === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      className={`rounded-[24px] border px-5 py-4 text-left transition ${
                        isActive
                          ? 'border-[#f19bc5] bg-[linear-gradient(180deg,#fff5fa,#fff)] shadow-[0_18px_40px_rgba(244,0,118,0.12)]'
                          : 'border-[#eee3e9] bg-white hover:border-[#e7ccd9] hover:bg-[#fffafc]'
                      }`}
                      onClick={() => setField('documentType', item.value)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-[#341338]">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-[#6c596f]">
                            {item.description}
                          </p>
                        </div>
                        <span
                          className={`h-4 w-4 rounded-full border ${
                            isActive
                              ? 'border-[#f40076] bg-[#f40076] shadow-[0_0_0_4px_rgba(244,0,118,0.12)]'
                              : 'border-[#cdbfcc] bg-white'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
                <FieldError message={validationErrors.documentType} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <TextInput
                label="Target university"
                placeholder="Example: University of Toronto"
                value={reviewForm.targetUniversity}
                onChange={(event) =>
                  setField('targetUniversity', event.target.value)
                }
                error={validationErrors.targetUniversity}
              />
              <TextInput
                label="Target program"
                placeholder="Example: MSc Data Science"
                value={reviewForm.targetProgram}
                onChange={(event) =>
                  setField('targetProgram', event.target.value)
                }
                error={validationErrors.targetProgram}
              />
              <TextInput
                label="Target country"
                placeholder="Example: Canada"
                value={reviewForm.targetCountry}
                onChange={(event) =>
                  setField('targetCountry', event.target.value)
                }
                error={validationErrors.targetCountry}
              />
              <TextInput
                label="Word limit"
                placeholder="650"
                inputMode="numeric"
                value={reviewForm.wordLimit}
                onChange={(event) => setField('wordLimit', event.target.value)}
                error={validationErrors.wordLimit}
              />
            </div>

            <div className="mt-6 grid gap-4">
              <TextArea
                label="Essay prompt or application brief"
                placeholder="Paste the college prompt, essay question, or instructions if you have them."
                rows={4}
                value={reviewForm.prompt}
                onChange={(event) => setField('prompt', event.target.value)}
                error={validationErrors.prompt}
              />
              <TextArea
                label="Applicant context"
                placeholder="Optional: achievements, intended theme, background, or what you want the admissions team to notice."
                rows={4}
                value={reviewForm.applicantContext}
                onChange={(event) =>
                  setField('applicantContext', event.target.value)
                }
                error={validationErrors.applicantContext}
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#4e3852]">
                  Review focus areas
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#9a879d]">
                  Pick up to 3
                </p>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {REVIEW_FOCUS_OPTIONS.map((item) => {
                  const isActive = reviewForm.focusAreas.includes(item.value);
                  return (
                    <button
                      key={item.value}
                      type="button"
                      className={`rounded-[22px] border px-4 py-4 text-left transition ${
                        isActive
                          ? 'border-[#f19bc5] bg-[#fff5fa]'
                          : 'border-[#eee3e9] bg-white hover:border-[#e5cad7] hover:bg-[#fffafc]'
                      }`}
                      onClick={() => toggleFocusArea(item.value)}
                    >
                      <p className="text-sm font-semibold text-[#341338]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#6c596f]">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
              <FieldError message={validationErrors.focusAreas} />
            </div>

            <div className="mt-6">
              <TextArea
                label="Paste your essay draft"
                placeholder="Paste the full SOP or essay draft here. You can also upload a PDF below."
                rows={11}
                value={reviewForm.essayText}
                onChange={(event) => setField('essayText', event.target.value)}
                error={validationErrors.essayText}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#f0e6eb] bg-[#fffdfd] px-4 py-3 text-sm text-[#6b586f]">
                <span>{draftWordCount} words in pasted draft</span>
                {targetWordLimit > 0 && (
                  <span
                    className={`rounded-full px-3 py-1 font-semibold ${
                      wordDelta > 0
                        ? 'bg-[#fff1f1] text-[#b42318]'
                        : 'bg-[#eefcf4] text-[#166534]'
                    }`}
                  >
                    {wordDelta > 0 ? `+${wordDelta}` : `${wordDelta}`} vs limit
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-dashed border-[#e7ccd9] bg-[linear-gradient(180deg,#fffafd,#fff)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#341338]">
                    Optional PDF upload
                  </p>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-[#6b586f]">
                    Upload a PDF if the draft is easier to review in document
                    form. Pasted text still works best for the strongest line
                    edits.
                  </p>
                </div>
                <label className="inline-flex cursor-pointer rounded-full bg-[#341338] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4d2050]">
                  Choose PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFile}
                  />
                </label>
              </div>
              <div className="mt-4 rounded-[22px] border border-[#f0e6eb] bg-white px-4 py-3 text-sm text-[#5f4a63]">
                {pdfFile ? pdfFile.name : 'No PDF selected'}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#f40076,#7e0f52)] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(244,0,118,0.22)] transition hover:translate-y-[-1px] hover:shadow-[0_24px_55px_rgba(244,0,118,0.28)]"
                onClick={reviewEssay}
                disabled={status.type === 'loading'}
              >
                {status.type === 'loading'
                  ? 'Reviewing draft...'
                  : 'Rate my essay'}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-[22px] border border-[#eadde4] px-5 py-4 text-sm font-semibold text-[#5f4a63] transition hover:border-[#d8c6d1] hover:bg-[#faf5f8]"
                onClick={resetAll}
              >
                Clear draft
              </button>
            </div>
          </div>

          <ReviewResults
            results={results}
            isLoading={status.type === 'loading'}
            draftWordCount={draftWordCount}
          />
        </div>
      </section>
    </div>
  );
}
