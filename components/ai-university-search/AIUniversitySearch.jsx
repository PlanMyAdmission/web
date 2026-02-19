'use client';

import React, { useMemo, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import '@/components/ai-admission/AIAdmissionTool.css';
import '@/components/ai-university-search/AIUniversitySearch.css';
import SearchHeader from '@/components/ai-university-search/SearchHeader.jsx';
import ProfileUpload from '@/components/ai-university-search/ProfileUpload.jsx';
import ResultsPanel from '@/components/ai-university-search/ResultsPanel.jsx';
const extractJson = (raw) => {
  if (!raw) return null;
  let trimmed = raw.trim();
  if (trimmed.startsWith('–')) {
    trimmed = trimmed.slice(1).trim();
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1);
  }
  const jsonStart = trimmed.indexOf('{');
  const jsonEnd = trimmed.lastIndexOf('}');
  const jsonSlice =
    jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart
      ? trimmed.slice(jsonStart, jsonEnd + 1)
      : trimmed;
  const blockMatch = trimmed.match(/```json\s*([\s\S]*?)```/i);
  const candidate = blockMatch ? blockMatch[1] : jsonSlice;
  try {
    const parsed = JSON.parse(candidate);
    if (typeof parsed === 'string') {
      try {
        return JSON.parse(parsed);
      } catch (_innerError) {
        return null;
      }
    }
    return parsed;
  } catch (_error) {
    return null;
  }
};
const getGeminiText = (result) => {
  if (!result) return '';
  if (typeof result.text === 'string') return result.text;
  if (typeof result.text === 'function') return result.text();
  const parts =
    result?.candidates?.[0]?.content?.parts ||
    result?.response?.candidates?.[0]?.content?.parts ||
    [];
  return parts.map((part) => part.text || '').join('\n');
};
const buildPrompt = (mode, courseQuery) => `
You are an admissions counselor. Provide university recommendations in JSON only.
Do not include markdown, commentary, or code fences.

Target course/search: ${courseQuery || 'Not provided'}

Input mode: ${mode}
If a PDF profile is attached, use it to personalize the results. If not, provide a strong general list.

Return JSON with this schema:
{
  "summary": "1-2 sentence overview",
  "universities": [
    {
      "name": "...",
      "country": "...",
      "program": "...",
      "fit": "Reach/Target/Safe",
      "reason": "1-2 sentence rationale"
    }
  ],
  "nextSteps": ["..."]
}

Return exactly 10 universities when possible.
`;
const universityJsonSchema = {
  type: 'object',
  properties: {
    summary: {
      type: 'string',
    },
    universities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
          program: {
            type: 'string',
          },
          fit: {
            type: 'string',
          },
          reason: {
            type: 'string',
          },
        },
        required: ['name', 'country', 'program', 'fit', 'reason'],
      },
    },
    nextSteps: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['summary', 'universities', 'nextSteps'],
};
const AIUniversitySearch = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState({
    type: 'idle',
    message: '',
  });
  const [results, setResults] = useState(null);
  const [courseQuery, setCourseQuery] = useState('');
  const resolvedApiKey = useMemo(
    () => process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    [],
  );
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
  const buildGeminiParts = async () => {
    const mode = pdfFile ? 'pdf' : 'search';
    const parts = [
      {
        text: buildPrompt(mode, courseQuery),
      },
    ];
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
  const generateRecommendations = async () => {
    if (!resolvedApiKey) {
      setStatus({
        type: 'error',
        message: 'AI service is not configured yet.',
      });
      return;
    }
    if (!courseQuery.trim()) {
      setStatus({
        type: 'error',
        message: 'Enter a course or program to search.',
      });
      return;
    }
    setStatus({
      type: 'loading',
      message: 'Finding university matches...',
    });
    setResults(null);
    try {
      const parts = await buildGeminiParts();
      const client = new GoogleGenAI({
        apiKey: resolvedApiKey,
        apiVersion: 'v1alpha',
      });
      const result = await client.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          {
            role: 'user',
            parts,
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: universityJsonSchema,
        },
      });
      const rawText = getGeminiText(result);
      if (result?.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
        throw new Error(
          'AI response was cut off. Please shorten the profile or try again.',
        );
      }
      const parsed = extractJson(rawText);
      if (!parsed) {
        throw new Error('Unable to parse Gemini response.');
      }
      setResults(parsed);
      setStatus({
        type: 'success',
        message: 'Recommendations ready.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error?.message || 'Something went wrong while generating results.',
      });
    }
  };
  const resetAll = () => {
    setPdfFile(null);
    setResults(null);
    setStatus({
      type: 'idle',
      message: '',
    });
    setCourseQuery('');
  };
  return (
    <div className="pma-ai-tool pma-uni-tool pma-uni-page">
      <div className="pma-ai-tool-header">
        <div>
          <p className="pma-ai-tool-eyebrow">Plan My Admission</p>
          <h2>AI University Search</h2>
          <p className="pma-ai-tool-subtitle">
            Provide a profile PDF or enter your details. We will suggest
            universities and programs that fit your goals.
          </p>
        </div>
      </div>

      <SearchHeader
        courseQuery={courseQuery}
        onQueryChange={setCourseQuery}
        onSearch={generateRecommendations}
      />

      <ProfileUpload pdfFile={pdfFile} onFileChange={handleFile} />

      {status.message && (
        <div className={`pma-ai-status ${status.type}`}>{status.message}</div>
      )}

      <div className="pma-ai-actions">
        <button
          className="pma-ai-primary"
          onClick={generateRecommendations}
          type="button"
          disabled={status.type === 'loading'}
        >
          {status.type === 'loading' ? 'Generating...' : 'Get Recommendations'}
        </button>
        <button className="pma-ai-secondary" onClick={resetAll} type="button">
          Reset
        </button>
      </div>

      <ResultsPanel results={results} />
    </div>
  );
};
export default AIUniversitySearch;
