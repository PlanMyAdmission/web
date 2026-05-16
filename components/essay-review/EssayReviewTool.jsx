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
import { trackAiToolEvent } from '@/lib/analytics/events.js';
import { fileToBase64, gatewayPost } from '@/lib/browser/client.js';

const inputClassName =
  'w-full rounded-md border border-[#ddcfda] bg-white px-4 py-3 text-sm text-[#3f1831] shadow-sm outline-none transition placeholder:text-[#9a8a9d] focus:border-[#f40076] focus:ring-4 focus:ring-[#f9dbe8]';

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
    <span className="mb-2 block text-sm font-semibold text-grey">{label}</span>
    <input className={inputClassName} {...props} />
    <FieldError message={error} />
  </label>
);

const TextArea = ({ label, error, rows = 4, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-grey">{label}</span>
    <textarea className={inputClassName} rows={rows} {...props} />
    <FieldError message={error} />
  </label>
);

export default function EssayReviewTool() {
  const [pdfFile, setPdfFile] = useState(null);
  const [results, setResults] = useState(null);
  const [runId, setRunId] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
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
    setRunId(null);
    setUnlocked(false);
    setReviewForm(INITIAL_REVIEW_FORM);
    setValidationErrors({});
    setStatus({ type: 'idle', message: '' });
    setFormStartedAt(Date.now());
  };

  const handleUnlock = (saveData) => {
    setUnlocked(true);
    setStatus({
      type: 'success',
      message:
        'Detailed review unlocked. We will reach out on WhatsApp shortly.',
    });
    trackAiToolEvent({
      toolName: 'essay_reviewer',
      action: 'unlock',
      status: 'success',
      leadId: saveData?.leadId || null,
    });
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
    setRunId(null);
    setUnlocked(false);
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
      const data = await gatewayPost('/tools/essay-review/review', {
        reviewForm,
        pdfBase64: pdfFile ? await fileToBase64(pdfFile) : '',
        pdfMimeType: pdfFile?.type || '',
      });

      if (!data || !data.result) {
        throw new Error('The AI review came back empty. Please try again.');
      }

      setResults(data.result);
      setRunId(data.runId || null);
      setStatus({
        type: 'success',
        message:
          'Your essay preview is ready. Unlock the line edits and revised excerpt below.',
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
    <div className="bg-white">
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-6 md:px-6 md:pt-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-main">
          AI Essay Reviewer
        </p>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold text-[#3f1831] leading-tight">
          Rate your SOP before it reaches admissions
        </h1>
        <p className="mt-3 text-base text-grey leading-relaxed max-w-2xl">
          Paste your draft (or upload a PDF) and get an admissions-style score,
          priority fixes, and line-level rewrites — across 6 rubric dimensions.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-14 md:px-6 md:pb-[4.5rem]">
        {status.message && status.type !== 'idle' && (
          <div
            className={`mb-6 rounded-md border px-5 py-4 text-sm font-medium ${statusClassNames[status.type]}`}
          >
            {status.message}
          </div>
        )}

        <div className="grid gap-6">
          <div className="rounded-md border border-[#e8dde3] bg-white p-6 shadow-sm md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-grey">
                  Submission form
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#3f1831]">
                  Build the review context
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-[#e8dde3] px-4 py-2 text-sm font-semibold text-grey transition hover:border-[#e8dde3] hover:bg-light"
                onClick={resetAll}
              >
                Reset
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-grey">Document type</p>
              <div className="mt-3 grid gap-3">
                {DOCUMENT_TYPE_OPTIONS.map((item) => {
                  const isActive = reviewForm.documentType === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      className={`rounded-md border px-5 py-4 text-left transition ${
                        isActive
                          ? 'border-[#e8dde3] bg-light shadow-sm'
                          : 'border-[#e8dde3] bg-white hover:border-[#e8dde3] hover:bg-light'
                      }`}
                      onClick={() => setField('documentType', item.value)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-[#3f1831]">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-grey">
                            {item.description}
                          </p>
                        </div>
                        <span
                          className={`h-4 w-4 rounded-full border ${
                            isActive
                              ? 'border-[#f40076] bg-[#f40076] shadow-[0_0_0_4px_rgba(244,0,118,0.12)]'
                              : 'border-[#e8dde3] bg-white'
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
                <p className="text-sm font-semibold text-grey">
                  Review focus areas
                </p>
                <p className="text-xs font-medium uppercase tracking-wider text-grey">
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
                      className={`rounded-md border px-4 py-4 text-left transition ${
                        isActive
                          ? 'border-[#e8dde3] bg-light'
                          : 'border-[#e8dde3] bg-white hover:border-[#e8dde3] hover:bg-light'
                      }`}
                      onClick={() => toggleFocusArea(item.value)}
                    >
                      <p className="text-sm font-semibold text-[#3f1831]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-grey">
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
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#e8dde3] bg-light px-4 py-3 text-sm text-grey">
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

            <div className="mt-6 rounded-md border border-dashed border-[#e8dde3] bg-light p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#3f1831]">
                    Optional PDF upload
                  </p>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-grey">
                    Upload a PDF if the draft is easier to review in document
                    form. Pasted text still works best for the strongest line
                    edits.
                  </p>
                </div>
                <label className="inline-flex cursor-pointer rounded-full bg-main px-4 py-2 text-sm font-semibold text-white transition hover:bg-main/90">
                  Choose PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFile}
                  />
                </label>
              </div>
              <div className="mt-4 rounded-md border border-[#e8dde3] bg-white px-4 py-3 text-sm text-grey">
                {pdfFile ? pdfFile.name : 'No PDF selected'}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-md bg-main px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-sm"
                onClick={reviewEssay}
                disabled={status.type === 'loading'}
              >
                {status.type === 'loading'
                  ? 'Reviewing draft...'
                  : 'Rate my essay'}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-[#e8dde3] px-5 py-4 text-sm font-semibold text-grey transition hover:border-[#e8dde3] hover:bg-light"
                onClick={resetAll}
              >
                Clear draft
              </button>
            </div>
          </div>

          {(results || status.type === 'loading') && (
            <ReviewResults
              results={results}
              isLoading={status.type === 'loading'}
              draftWordCount={draftWordCount}
              runId={runId}
              unlocked={unlocked}
              onUnlock={handleUnlock}
            />
          )}
        </div>
      </section>
    </div>
  );
}
