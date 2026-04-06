import 'server-only';

import { GoogleGenAI } from '@google/genai';

export const getGeminiApiKey = () => process.env.GEMINI_API_KEY || '';
export const DEFAULT_GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const DEFAULT_FALLBACK_MODELS = ['gemini-2.5-pro', 'gemini-3-pro-preview'];

const parseModelList = (value = '') =>
  Array.from(
    new Set(
      `${value || ''}`
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  );

export const getGeminiClient = () => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('AI service is not configured yet.');
  }

  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1alpha',
  });
};

export const getGeminiModelCandidates = (
  preferredModel = DEFAULT_GEMINI_MODEL,
) => {
  const configuredFallbacks = parseModelList(
    process.env.GEMINI_FALLBACK_MODELS,
  );

  return Array.from(
    new Set([
      preferredModel,
      ...(configuredFallbacks.length
        ? configuredFallbacks
        : DEFAULT_FALLBACK_MODELS),
    ]),
  ).filter(Boolean);
};

export const shouldRetryWithFallbackModel = (error) =>
  /404|not found|not available|no longer available|unsupported|not supported/i.test(
    `${error?.message || ''}`,
  );

export const generateStructuredGeminiContent = async ({
  model = DEFAULT_GEMINI_MODEL,
  contents,
  schema,
  config = {},
}) => {
  const client = getGeminiClient();
  const candidates = getGeminiModelCandidates(model);
  let lastError = null;

  for (const candidate of candidates) {
    try {
      const result = await client.models.generateContent({
        model: candidate,
        contents,
        config: {
          ...config,
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      return {
        model: candidate,
        result,
      };
    } catch (error) {
      lastError = error;

      if (!shouldRetryWithFallbackModel(error)) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Unable to generate AI response.');
};

export const generateGeminiTextContent = async ({
  model = DEFAULT_GEMINI_MODEL,
  contents,
  config = {},
}) => {
  const client = getGeminiClient();
  const candidates = getGeminiModelCandidates(model);
  let lastError = null;

  for (const candidate of candidates) {
    try {
      const result = await client.models.generateContent({
        model: candidate,
        contents,
        config,
      });

      return {
        model: candidate,
        result,
      };
    } catch (error) {
      lastError = error;

      if (!shouldRetryWithFallbackModel(error)) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Unable to generate AI response.');
};

export const extractJson = (raw) => {
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

export const getGeminiText = async (result) => {
  if (!result) return '';
  if (typeof result.text === 'string') return result.text;
  if (typeof result.text === 'function') {
    const text = await result.text();
    return typeof text === 'string' ? text : '';
  }
  const parts =
    result?.candidates?.[0]?.content?.parts ||
    result?.response?.candidates?.[0]?.content?.parts ||
    [];
  return parts.map((part) => part.text || '').join('\n');
};
