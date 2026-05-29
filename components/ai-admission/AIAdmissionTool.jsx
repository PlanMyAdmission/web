'use client';

import React, { useEffect, useState } from 'react';
import { buildAdmissionReportHtml } from '@/components/ai-admission/pdfReport.js';
import StartStep from '@/components/ai-admission/steps/StartStep.jsx';
import CourseStep from '@/components/ai-admission/steps/CourseStep.jsx';
import ExtrasStep from '@/components/ai-admission/steps/ExtrasStep.jsx';
import ProcessingStep from '@/components/ai-admission/steps/ProcessingStep.jsx';
import ResultStep from '@/components/ai-admission/steps/ResultStep.jsx';
import AdmissionToolHeader from '@/components/ai-admission/AdmissionToolHeader.jsx';
import StepProgress from '@/components/ai-tools/StepProgress.jsx';
import initialForm from '@/components/ai-admission/lib/initialForm.js';
import { buildProfilePayload } from '@/components/ai-admission/lib/profilePayload.js';
import useProfileStorage from '@/components/ai-admission/hooks/useProfileStorage.js';
import {
  canContinueFromAcademics,
  canContinueFromGoal,
  canSubmitContext,
  LOADING_MESSAGES,
  STEP_LABELS,
  openReportPrintWindow,
} from '@/components/ai-admission/lib/admissionToolHelpers.js';
import { trackAiToolEvent } from '@/lib/analytics/events.js';
import { uploadPdf, gatewayPost } from '@/lib/browser/client.js';

const FLOW_TO_STEP_INDEX = {
  start: 0,
  course: 1,
  extras: 2,
  processing: 3,
  result: 3,
};

const STATUS_STYLES = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  loading: 'bg-light border-[#e8dde3] text-[#3f1831]',
};

const AIAdmissionTool = () => {
  const [mode, setMode] = useState('form');
  const [flow, setFlow] = useState('start');
  const [formData, setFormData] = useState(initialForm);
  const [pdfFile, setPdfFile] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [reportHtml, setReportHtml] = useState('');
  const [runId, setRunId] = useState(null);
  const [claimToken, setClaimToken] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const { persistProfile } = useProfileStorage(formData, setFormData);

  const setField = (field) => (event) => {
    setFormData((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPdfFile(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setStatus({ type: 'error', message: 'Please upload a PDF file.' });
      return;
    }
    setPdfFile(file);
  };

  useEffect(() => {
    if (status.type !== 'loading') return undefined;
    const interval = setInterval(() => {
      setLoadingMessageIndex((p) => (p + 1) % LOADING_MESSAGES.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [status.type]);

  const buildReportHtml = (parsed) => {
    const profilePayload = buildProfilePayload(formData);
    const mergedProfile = { ...parsed?.profile, ...profilePayload };
    return buildAdmissionReportHtml({
      profile: mergedProfile,
      evaluation: parsed,
      sourceLabel: pdfFile ? pdfFile.name : 'Profile form submission',
    });
  };

  const generateReport = async () => {
    if (mode === 'form') {
      if (
        !canContinueFromGoal(formData) ||
        !canContinueFromAcademics(formData)
      ) {
        setStatus({
          type: 'error',
          message: 'Please complete destination, program, intake, and score.',
        });
        setFlow('start');
        return;
      }
    } else if (!pdfFile) {
      setStatus({
        type: 'error',
        message: 'Please upload a PDF profile to continue.',
      });
      setFlow('start');
      return;
    }

    setStatus({ type: 'loading', message: 'Analyzing your profile…' });
    setLoadingMessageIndex(0);
    setReportData(null);
    setPreview(null);
    setReportHtml('');
    setRunId(null);
    setUnlocked(false);
    trackAiToolEvent({
      toolName: 'admission_evaluation',
      action: 'generate',
      status: 'started',
      mode,
      hasPdf: Boolean(pdfFile),
    });

    if (mode === 'form') persistProfile();

    try {
      const fileKey = pdfFile ? await uploadPdf(pdfFile) : null;
      const data = await gatewayPost('/tools/admission/report', {
        formData,
        mode,
        ...(fileKey ? { fileKey } : {}),
      });
      const parsed = data?.result;
      if (!parsed) throw new Error('Unable to parse AI response.');

      setReportData(parsed);
      setPreview(data?.preview || null);
      setRunId(data?.runId || null);
      setClaimToken(data?.claimToken || null);
      setReportHtml(buildReportHtml(parsed));
      setStatus({
        type: 'success',
        message: 'Preview ready. Unlock your full report below.',
      });
      setFlow('result');
      trackAiToolEvent({
        toolName: 'admission_evaluation',
        action: 'generate',
        status: 'success',
        mode,
        hasPdf: Boolean(pdfFile),
      });
    } catch (error) {
      trackAiToolEvent({
        toolName: 'admission_evaluation',
        action: 'generate',
        status: 'error',
        mode,
        hasPdf: Boolean(pdfFile),
      });
      setStatus({
        type: 'error',
        message:
          error?.message || 'Something went wrong while generating the report.',
      });
      setFlow('start');
    }
  };

  const handleUnlock = (saveData) => {
    setUnlocked(true);
    setStatus({
      type: 'success',
      message: 'Report unlocked. We will reach out on WhatsApp shortly.',
    });
    trackAiToolEvent({
      toolName: 'admission_evaluation',
      action: 'unlock',
      status: 'success',
      leadId: saveData?.leadId || null,
    });
  };

  const resetAll = () => {
    setFormData(initialForm);
    setPdfFile(null);
    setReportData(null);
    setPreview(null);
    setReportHtml('');
    setRunId(null);
    setClaimToken(null);
    setUnlocked(false);
    setStatus({ type: 'idle', message: '' });
    setFlow('start');
    setMode('form');
  };

  const handlePrint = () => {
    if (!unlocked) return;
    const result = openReportPrintWindow(reportHtml);
    if (!result.ok && result.reason === 'popup_blocked') {
      setStatus({
        type: 'error',
        message: 'Pop-up blocked. Please allow pop-ups to download the PDF.',
      });
    }
  };

  const currentStepIndex = FLOW_TO_STEP_INDEX[flow] ?? 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 md:py-10 md:px-6">
      <AdmissionToolHeader />

      {mode === 'form' && flow !== 'result' && flow !== 'processing' ? (
        <StepProgress steps={STEP_LABELS} activeStep={currentStepIndex} />
      ) : null}

      {flow === 'start' && (
        <StartStep
          mode={mode}
          onModeChange={(nextMode) => {
            setMode(nextMode);
            setStatus({ type: 'idle', message: '' });
          }}
          pdfFile={pdfFile}
          onFileChange={handleFile}
          formData={formData}
          setField={setField}
          onContinue={() => {
            if (!canContinueFromGoal(formData)) {
              setStatus({
                type: 'error',
                message:
                  'Please pick destination, degree, program, and intake.',
              });
              return;
            }
            setStatus({ type: 'idle', message: '' });
            setFlow('course');
          }}
          onAnalyze={() => {
            setFlow('processing');
            generateReport();
          }}
        />
      )}

      {flow === 'course' && (
        <CourseStep
          formData={formData}
          setField={setField}
          onBack={() => setFlow('start')}
          onNext={() => {
            if (!canContinueFromAcademics(formData)) {
              setStatus({
                type: 'error',
                message: 'Please enter your academic score.',
              });
              return;
            }
            setStatus({ type: 'idle', message: '' });
            setFlow('extras');
          }}
        />
      )}

      {flow === 'extras' && (
        <ExtrasStep
          formData={formData}
          setField={setField}
          onBack={() => setFlow('course')}
          onSubmit={() => {
            if (!canSubmitContext(formData)) {
              setStatus({
                type: 'error',
                message: 'Pick a budget bucket to continue.',
              });
              return;
            }
            setFlow('processing');
            generateReport();
          }}
        />
      )}

      {flow === 'processing' && (
        <ProcessingStep message={LOADING_MESSAGES[loadingMessageIndex]} />
      )}

      {status.message &&
        status.type !== 'loading' &&
        status.type !== 'idle' && (
          <div
            className={`mt-4 px-4 py-3 rounded-md border text-sm ${STATUS_STYLES[status.type] || STATUS_STYLES.loading}`}
          >
            {status.message}
          </div>
        )}

      {flow === 'result' && (
        <ResultStep
          reportData={reportData}
          preview={preview}
          runId={runId}
          claimToken={claimToken}
          unlocked={unlocked}
          onUnlock={handleUnlock}
          onDownload={handlePrint}
          onReset={resetAll}
        />
      )}
    </div>
  );
};

export default AIAdmissionTool;
