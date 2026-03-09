import 'server-only';

import { GoogleGenAI } from '@google/genai';

export const getGeminiApiKey = () => process.env.GEMINI_API_KEY || '';

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

export const getGeminiText = (result) => {
  if (!result) return '';
  if (typeof result.text === 'string') return result.text;
  if (typeof result.text === 'function') return result.text();
  const parts =
    result?.candidates?.[0]?.content?.parts ||
    result?.response?.candidates?.[0]?.content?.parts ||
    [];
  return parts.map((part) => part.text || '').join('\n');
};
