'use client';

import React, { useState } from 'react';
import uniStyles from '@/components/ai-university-search/AIUniversitySearch.module.css';
import { useAuth } from '@context/AuthProvider';
import { trackAiToolEvent } from '@lib/analytics.js';
import { fileToBase64 } from '@lib/clientUtils.js';
import SearchHeader from '@/components/ai-university-search/SearchHeader.jsx';
import ProfileUpload from '@/components/ai-university-search/ProfileUpload.jsx';
import ResultsPanel from '@/components/ai-university-search/ResultsPanel.jsx';
import {
  HERO_CHIPS,
  INITIAL_SEARCH_PROFILE,
  STEP_BY_FIELD,
  validateSearchProfile,
} from '@/components/ai-university-search/searchProfile.js';

const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => uniStyles[name])
    .filter(Boolean)
    .join(' ');

const AIUniversitySearch = () => {
  const { currentUser } = useAuth();
  const [pdfFile, setPdfFile] = useState(null);
  const [results, setResults] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [searchProfile, setSearchProfile] = useState(INITIAL_SEARCH_PROFILE);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

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
        message: 'Please complete the required fields to generate reliable matches.',
      });
      return;
    }

    setValidationErrors({});
    setStatus({
      type: 'loading',
      message: 'Generating family-friendly best-fit university matches...',
    });
    setResults(null);
    trackAiToolEvent({
      toolName: 'university_matchmaker',
      action: 'generate',
      status: 'started',
      mode: pdfFile ? 'pdf' : 'search',
      hasPdf: Boolean(pdfFile),
    });

    try {
      const response = await fetch('/api/ai/university-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchProfile,
          pdfBase64: pdfFile ? await fileToBase64(pdfFile) : '',
          pdfMimeType: pdfFile?.type || '',
          leadContext: {
            currentUser: {
              uid: currentUser?.uid || null,
              email: currentUser?.email || null,
              displayName: currentUser?.displayName || null,
            },
            formStartedAt,
            honeypot: '',
          },
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Something went wrong while generating results.');
      }

      const parsed = payload?.data;
      if (!parsed) {
        throw new Error('Unable to parse AI response. Please retry.');
      }

      setResults(parsed);
      trackAiToolEvent({
        toolName: 'university_matchmaker',
        action: 'generate',
        status: 'success',
        mode: pdfFile ? 'pdf' : 'search',
        hasPdf: Boolean(pdfFile),
      });
      setStatus({ type: 'success', message: 'Your parent and student friendly matches are ready.' });
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
        message: error?.message || 'Something went wrong while generating results.',
      });
    }
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
    setValidationErrors({});
    setActiveStep(0);
    setStatus({ type: 'idle', message: '' });
    setSearchProfile(INITIAL_SEARCH_PROFILE);
    setFormStartedAt(Date.now());
  };

  return (
    <div className={cx('pma-uni-root')}>
      <div className={cx('pma-uni-hero')}>
        <div className={cx('pma-uni-hero-main')}>
          <p className={cx('pma-uni-eyebrow')}>Plan My Admission</p>
          <h2>AI University Matchmaker</h2>
          <p className={cx('pma-uni-subtitle')}>
            Build a clear shortlist that both students and parents can trust. This guided
            flow captures academics, budget, and family priorities before generating matches.
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
        <div className={cx('pma-uni-status', `pma-uni-status-${status.type}`)}>{status.message}</div>
      )}

      <ResultsPanel results={results} />
    </div>
  );
};

export default AIUniversitySearch;
