'use client';

import React, { useState } from 'react';
import uniStyles from '@/components/ai-university-search/AIUniversitySearch.module.css';
import { trackAiToolEvent } from '@/lib/analytics/events.js';
import { uploadPdf, gatewayPost } from '@/lib/browser/client.js';
import SearchHeader from '@/components/ai-university-search/SearchHeader.jsx';
import ProfileUpload from '@/components/ai-university-search/ProfileUpload.jsx';
import ResultsPanel from '@/components/ai-university-search/ResultsPanel.jsx';
import StepProgress from '@/components/ai-tools/StepProgress.jsx';
import {
  HERO_CHIPS,
  INITIAL_SEARCH_PROFILE,
  STEP_BY_FIELD,
  validateSearchProfile,
} from '@/components/ai-university-search/searchProfile.js';

const STEP_LABELS = ['Profile', 'Academics', 'Preferences'];

const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => uniStyles[name])
    .filter(Boolean)
    .join(' ');

const AIUniversitySearch = () => {
  const [results, setResults] = useState(null);
  const [preview, setPreview] = useState(null);
  const [runId, setRunId] = useState(null);
  const [claimToken, setClaimToken] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [searchProfile, setSearchProfile] = useState(INITIAL_SEARCH_PROFILE);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [pdfFile, setPdfFile] = useState(null);

  const setSearchField = (field, value) => {
    setSearchProfile((previous) => {
      const next = { ...previous, [field]: value };

      if (field === 'englishTestStatus' && value !== 'taken') {
        next.englishTestType = '';
        next.englishTestScore = '';
      }

      return next;
    });

    setValidationErrors((previous) => {
      const next = { ...previous };
      delete next[field];

      if (field === 'englishTestStatus' && value !== 'taken') {
        delete next.englishTestType;
        delete next.englishTestScore;
      }

      return next;
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
        toolName: 'university_matchmaker',
        action: 'upload_pdf',
        status: 'invalid_file_type',
      });
      setStatus({ type: 'error', message: 'Please upload a PDF file.' });
      return;
    }

    setPdfFile(file);
    trackAiToolEvent({
      toolName: 'university_matchmaker',
      action: 'upload_pdf',
      status: 'selected',
      hasPdf: true,
    });
  };

  const generateRecommendations = async () => {
    const nextErrors = validateSearchProfile(searchProfile);
    if (Object.keys(nextErrors).length > 0) {
      trackAiToolEvent({
        toolName: 'university_matchmaker',
        action: 'generate',
        status: 'validation_failed',
        mode: pdfFile ? 'pdf' : 'search',
        hasPdf: Boolean(pdfFile),
      });
      setValidationErrors(nextErrors);
      const firstErrorField = Object.keys(nextErrors)[0];
      setActiveStep(STEP_BY_FIELD[firstErrorField] ?? 0);
      setStatus({
        type: 'error',
        message:
          'Please complete the required fields to generate reliable matches.',
      });
      return;
    }

    setValidationErrors({});
    setStatus({
      type: 'loading',
      message: 'Generating your family-friendly shortlist…',
    });
    setResults(null);
    setPreview(null);
    setRunId(null);
    setClaimToken(null);
    setUnlocked(false);
    trackAiToolEvent({
      toolName: 'university_matchmaker',
      action: 'generate',
      status: 'started',
      mode: pdfFile ? 'pdf' : 'search',
      hasPdf: Boolean(pdfFile),
    });

    try {
      const fileKey = pdfFile ? await uploadPdf(pdfFile) : null;
      const data = await gatewayPost('/tools/university-match/match', {
        searchProfile,
        ...(fileKey ? { fileKey } : {}),
      });
      const parsed = data?.result;
      if (!parsed) {
        throw new Error('Unable to parse AI response. Please retry.');
      }

      setResults(parsed);
      setPreview(data?.preview || null);
      setRunId(data?.runId || null);
      setClaimToken(data?.claimToken || null);
      trackAiToolEvent({
        toolName: 'university_matchmaker',
        action: 'generate',
        status: 'success',
        mode: pdfFile ? 'pdf' : 'search',
        hasPdf: Boolean(pdfFile),
      });
      setStatus({
        type: 'success',
        message:
          'Preview ready. Unlock to see all matches and detailed next steps.',
      });
    } catch (error) {
      trackAiToolEvent({
        toolName: 'university_matchmaker',
        action: 'generate',
        status: 'error',
        mode: pdfFile ? 'pdf' : 'search',
        hasPdf: Boolean(pdfFile),
      });
      setStatus({
        type: 'error',
        message:
          error?.message || 'Something went wrong while generating results.',
      });
    }
  };

  const handleUnlock = (saveData) => {
    setUnlocked(true);
    setStatus({
      type: 'success',
      message: 'Shortlist unlocked. We will reach out on WhatsApp shortly.',
    });
    trackAiToolEvent({
      toolName: 'university_matchmaker',
      action: 'unlock',
      status: 'success',
      leadId: saveData?.leadId || null,
    });
  };

  const resetAll = () => {
    trackAiToolEvent({
      toolName: 'university_matchmaker',
      action: 'reset',
      status: 'completed',
      mode: pdfFile ? 'pdf' : 'search',
      hasPdf: Boolean(pdfFile),
    });
    setPdfFile(null);
    setResults(null);
    setPreview(null);
    setRunId(null);
    setClaimToken(null);
    setUnlocked(false);
    setValidationErrors({});
    setActiveStep(0);
    setStatus({ type: 'idle', message: '' });
    setSearchProfile(INITIAL_SEARCH_PROFILE);
  };

  return (
    <div className={cx('pma-uni-root')}>
      <div className={cx('pma-uni-hero')}>
        <div className={cx('pma-uni-hero-main')}>
          <p className={cx('pma-uni-eyebrow')}>Plan My Admission</p>
          <h2>AI University Matchmaker</h2>
          <p className={cx('pma-uni-subtitle')}>
            Build a clear shortlist that both students and parents can trust.
            Answer a few questions, see your top matches free, then unlock the
            full shortlist to share with family.
          </p>
          <div className={cx('pma-uni-chip-row')}>
            {HERO_CHIPS.map((chip) => (
              <span key={chip} className={cx('pma-uni-chip')}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!results ? (
        <StepProgress steps={STEP_LABELS} activeStep={activeStep} />
      ) : null}

      <SearchHeader
        searchProfile={searchProfile}
        onFieldChange={setSearchField}
        onSearch={generateRecommendations}
        onReset={resetAll}
        activeStep={activeStep}
        onStepChange={setActiveStep}
        validationErrors={validationErrors}
        isLoading={status.type === 'loading'}
      />

      <ProfileUpload pdfFile={pdfFile} onFileChange={handleFile} />

      {status.message && (
        <div className={cx('pma-uni-status', `pma-uni-status-${status.type}`)}>
          {status.message}
        </div>
      )}

      <ResultsPanel
        results={results}
        preview={preview}
        runId={runId}
        claimToken={claimToken}
        unlocked={unlocked}
        onUnlock={handleUnlock}
      />
    </div>
  );
};

export default AIUniversitySearch;
