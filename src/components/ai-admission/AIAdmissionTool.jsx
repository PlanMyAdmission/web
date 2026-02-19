import React, { useEffect, useMemo, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import './AIAdmissionTool.css';
import { buildAdmissionReportHtml } from './pdfReport';
import StartStep from './steps/StartStep';
import CourseStep from './steps/CourseStep';
import ExtrasStep from './steps/ExtrasStep';
import ProcessingStep from './steps/ProcessingStep';
import ResultStep from './steps/ResultStep';
import initialForm from './lib/initialForm';
import { extractJson, getGeminiText } from './lib/json';
import { admissionJsonSchema, buildPrompt } from './lib/prompt';
import useProfileStorage from './hooks/useProfileStorage';

const AIAdmissionTool = () => {
  const [mode, setMode] = useState('form');
  const [flow, setFlow] = useState('start');
  const [formData, setFormData] = useState(initialForm);
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [reportData, setReportData] = useState(null);
  const [reportHtml, setReportHtml] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const resolvedApiKey = useMemo(
    () => process.env.REACT_APP_GEMINI_API_KEY,
    [],
  );

  const setField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const { persistProfile } = useProfileStorage(formData, setFormData);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPdfFile(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setStatus({
        type: 'error',
        message: 'Please upload a PDF file.',
      });
      return;
    }
    setPdfFile(file);
  };

  useEffect(() => {
    if (status.type !== 'loading') return;
    const messages = [
      'Evaluating transcripts and academic fit...',
      'Mapping strengths to program requirements...',
      'Estimating admission competitiveness...',
      'Drafting personalized recommendations...',
    ];
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [status.type]);

  const buildGeminiParts = async () => {
    const parts = [{ text: buildPrompt(formData, mode) }];
    if (pdfFile) {
      const buffer = await pdfFile.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: base64,
        },
        mediaResolution: {
          level: 'media_resolution_medium',
        },
      });
    }
    return parts;
  };

  const generateReport = async () => {
    if (!resolvedApiKey) {
      setStatus({
        type: 'error',
        message: 'AI service is not configured yet.',
      });
      return;
    }

    if (mode === 'form') {
      const hasMinimum = formData.fullName && formData.lastName;
      if (!hasMinimum) {
        setStatus({
          type: 'error',
          message: 'Please add your first and last name to continue.',
        });
        return;
      }
    } else if (!pdfFile) {
      setStatus({
        type: 'error',
        message: 'Please upload a PDF profile to continue.',
      });
      return;
    }

    setStatus({ type: 'loading', message: 'Analyzing your profile...' });
    setReportData(null);
    setReportHtml('');
    if (mode === 'form') {
      persistProfile();
    }

    try {
      const parts = await buildGeminiParts();
      const client = new GoogleGenAI({
        apiKey: resolvedApiKey,
        apiVersion: 'v1alpha',
      });
      const result = await client.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: admissionJsonSchema,
        },
      });

      console.log('Gemini raw result:', result);
      const text = getGeminiText(result);
      console.log('Gemini extracted text:', text);
      if (result?.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
        throw new Error(
          'AI response was cut off. Please shorten the profile or try again.',
        );
      }
      const parsed = extractJson(text);

      if (!parsed) {
        throw new Error('Unable to parse Gemini response.');
      }

      const mergedProfile = {
        ...parsed?.profile,
        ...formData,
      };

      const html = buildAdmissionReportHtml({
        profile: mergedProfile,
        evaluation: parsed,
        sourceLabel: pdfFile ? pdfFile.name : 'Profile form submission',
      });

      setReportData(parsed);
      setReportHtml(html);
      setStatus({ type: 'success', message: 'Report ready to download.' });
      setFlow('result');
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error?.message || 'Something went wrong while generating the report.',
      });
      setFlow('start');
    }
  };

  const resetAll = () => {
    setFormData(initialForm);
    setPdfFile(null);
    setReportData(null);
    setReportHtml('');
    setStatus({ type: 'idle', message: '' });
    setFlow('start');
    setMode('form');
  };

  const handlePrint = () => {
    if (!reportHtml) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setStatus({
        type: 'error',
        message: 'Pop-up blocked. Please allow pop-ups to download the PDF.',
      });
      return;
    }
    printWindow.document.open();
    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <div className="pma-ai-tool">
      <div className="pma-ai-tool-header">
        <div>
          <p className="pma-ai-tool-eyebrow">Plan My Admission</p>
          <h2>AI Admission Evaluation</h2>
          <p className="pma-ai-tool-subtitle">
            Upload a profile PDF or enter key details. We will generate a
            college evaluation report and let you download it as a PDF.
          </p>
        </div>
      </div>

      {flow === 'start' && (
        <StartStep
          mode={mode}
          onModeChange={setMode}
          pdfFile={pdfFile}
          onFileChange={handleFile}
          formData={formData}
          setField={setField}
          onContinue={() => {
            if (!formData.fullName || !formData.lastName) {
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
          onNext={() => setFlow('extras')}
        />
      )}

      {flow === 'extras' && (
        <ExtrasStep
          formData={formData}
          setField={setField}
          onBack={() => setFlow('course')}
          onSubmit={() => {
            setFlow('processing');
            generateReport();
          }}
        />
      )}

      {flow === 'processing' && (
        <ProcessingStep
          message={
            [
              'Evaluating transcripts and academic fit...',
              'Mapping strengths to program requirements...',
              'Estimating admission competitiveness...',
              'Drafting personalized recommendations...',
            ][loadingMessageIndex]
          }
        />
      )}

      {status.message && status.type !== 'loading' && (
        <div className={`pma-ai-status ${status.type}`}>{status.message}</div>
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
