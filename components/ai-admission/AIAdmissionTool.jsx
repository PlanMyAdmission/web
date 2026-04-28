'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/components/ai-admission/AIAdmissionTool.module.css';
import { buildAdmissionReportHtml } from '@/components/ai-admission/pdfReport.js';
import StartStep from '@/components/ai-admission/steps/StartStep.jsx';
import CourseStep from '@/components/ai-admission/steps/CourseStep.jsx';
import ExtrasStep from '@/components/ai-admission/steps/ExtrasStep.jsx';
import ProcessingStep from '@/components/ai-admission/steps/ProcessingStep.jsx';
import ResultStep from '@/components/ai-admission/steps/ResultStep.jsx';
import AdmissionToolHeader from '@/components/ai-admission/AdmissionToolHeader.jsx';
import initialForm from '@/components/ai-admission/lib/initialForm.js';
import { buildProfilePayload } from '@/components/ai-admission/lib/profilePayload.js';
import useProfileStorage from '@/components/ai-admission/hooks/useProfileStorage.js';
import {
  canContinueFromCourse,
  canContinueFromStart,
  canSubmitExtras,
  LOADING_MESSAGES,
  openReportPrintWindow,
} from '@/components/ai-admission/lib/admissionToolHelpers.js';
import { trackAiToolEvent } from '@/lib/analytics.js';
import { fileToBase64 } from '@/lib/clientUtils.js';
import { mapModuleClasses } from '@/lib/cx.js';
const cx = (...classNames) => mapModuleClasses(styles, ...classNames);

const AIAdmissionTool = () => {
  const [mode, setMode] = useState('form');
  const [flow, setFlow] = useState('start');
  const [formData, setFormData] = useState(initialForm);
  const [pdfFile, setPdfFile] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportHtml, setReportHtml] = useState('');
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
      trackAiToolEvent({
        toolName: 'admission_evaluation',
        action: 'upload_pdf',
        status: 'invalid_file_type',
      });
      setStatus({ type: 'error', message: 'Please upload a PDF file.' });
      return;
    }
    setPdfFile(file);
    trackAiToolEvent({
      toolName: 'admission_evaluation',
      action: 'upload_pdf',
      status: 'selected',
      mode,
      hasPdf: true,
    });
  };

  useEffect(() => {
    if (status.type !== 'loading') {
      return undefined;
    }
    const interval = setInterval(() => {
      setLoadingMessageIndex(
        (previous) => (previous + 1) % LOADING_MESSAGES.length,
      );
    }, 1600);
    return () => clearInterval(interval);
  }, [status.type]);

  const generateReport = async () => {
    if (mode === 'form') {
      if (!canContinueFromStart(formData)) {
        trackAiToolEvent({
          toolName: 'admission_evaluation',
          action: 'generate',
          status: 'validation_failed',
          mode,
          hasPdf: Boolean(pdfFile),
        });
        setStatus({
          type: 'error',
          message: 'Please add your first and last name to continue.',
        });
        setFlow('start');
        return;
      }
    } else if (!pdfFile) {
      trackAiToolEvent({
        toolName: 'admission_evaluation',
        action: 'generate',
        status: 'validation_failed',
        mode,
        hasPdf: false,
      });
      setStatus({
        type: 'error',
        message: 'Please upload a PDF profile to continue.',
      });
      setFlow('start');
      return;
    }

    setStatus({ type: 'loading', message: 'Analyzing your profile...' });
    setLoadingMessageIndex(0);
    setReportData(null);
    setReportHtml('');
    trackAiToolEvent({
      toolName: 'admission_evaluation',
      action: 'generate',
      status: 'started',
      mode,
      hasPdf: Boolean(pdfFile),
    });

    if (mode === 'form') {
      persistProfile();
    }

    try {
      const profilePayload = buildProfilePayload(formData);
      const response = await fetch('/api/ai/admission-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          mode,
          pdfBase64: pdfFile ? await fileToBase64(pdfFile) : '',
          pdfMimeType: pdfFile?.type || '',
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload?.error || 'Something went wrong while generating the report.',
        );
      }

      const parsed = payload?.data;
      if (!parsed) {
        throw new Error('Unable to parse AI response.');
      }

      const mergedProfile = { ...parsed?.profile, ...profilePayload };
      const html = buildAdmissionReportHtml({
        profile: mergedProfile,
        evaluation: parsed,
        sourceLabel: pdfFile ? pdfFile.name : 'Profile form submission',
      });

      setReportData(parsed);
      setReportHtml(html);
      setStatus({ type: 'success', message: 'Report ready to download.' });
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

  const resetAll = () => {
    trackAiToolEvent({
      toolName: 'admission_evaluation',
      action: 'reset',
      status: 'completed',
      mode,
      hasPdf: Boolean(pdfFile),
    });
    setFormData(initialForm);
    setPdfFile(null);
    setReportData(null);
    setReportHtml('');
    setStatus({ type: 'idle', message: '' });
    setFlow('start');
    setMode('form');
  };

  const handlePrint = () => {
    trackAiToolEvent({
      toolName: 'admission_evaluation',
      action: 'download_report',
      status: 'started',
      mode,
      hasPdf: Boolean(pdfFile),
    });

    const result = openReportPrintWindow(reportHtml);
    if (!result.ok && result.reason === 'popup_blocked') {
      setStatus({
        type: 'error',
        message: 'Pop-up blocked. Please allow pop-ups to download the PDF.',
      });
    }
  };

  return (
    <div className={cx('pma-ai-tool')}>
      <AdmissionToolHeader cx={cx} />

      {flow === 'start' && (
        <StartStep
          mode={mode}
          onModeChange={(nextMode) => {
            setMode(nextMode);
            trackAiToolEvent({
              toolName: 'admission_evaluation',
              action: 'mode_change',
              status: 'selected',
              mode: nextMode,
            });
          }}
          pdfFile={pdfFile}
          onFileChange={handleFile}
          formData={formData}
          setField={setField}
          onContinue={() => {
            if (!canContinueFromStart(formData)) {
              setStatus({
                type: 'error',
                message: 'Please enter first and last name to continue.',
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
            if (!canContinueFromCourse(formData)) {
              setStatus({
                type: 'error',
                message:
                  'Please complete country, degree level, program area, and academic score.',
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
            if (!canSubmitExtras(formData)) {
              setStatus({
                type: 'error',
                message: 'Please add target intake and yearly budget amount.',
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

      {status.message && status.type !== 'loading' && (
        <div className={cx('pma-ai-status', status.type)}>{status.message}</div>
      )}

      {flow === 'result' && (
        <ResultStep
          reportData={reportData}
          onDownload={handlePrint}
          onReset={resetAll}
        />
      )}
    </div>
  );
};

export default AIAdmissionTool;
