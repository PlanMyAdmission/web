import { NextResponse } from 'next/server';
import {
  admissionJsonSchema,
  buildPrompt,
} from '@components/ai-admission/lib/prompt.js';
import { buildProfilePayload } from '@components/ai-admission/lib/profilePayload.js';
import { getGeminiClient, extractJson, getGeminiText } from '@lib/ai/gemini.js';
import {
  enforceRequestRateLimit,
  validateAdmissionReportRequest,
  validatePdfPayload,
} from '@lib/ai/requestGuards.js';

export async function POST(request) {
  try {
    const requestPolicyError = await enforceRequestRateLimit({
      request,
      routeKey: 'ai:admission-report',
      limit: 6,
    });
    if (requestPolicyError) {
      return NextResponse.json(
        { error: requestPolicyError.error },
        {
          status: requestPolicyError.status,
          headers: requestPolicyError.retryAfterSeconds
            ? { 'Retry-After': `${requestPolicyError.retryAfterSeconds}` }
            : undefined,
        },
      );
    }

    const { formData, mode, pdfBase64, pdfMimeType } = await request.json();

    if (!formData || typeof formData !== 'object') {
      return NextResponse.json(
        { error: 'Missing profile form data.' },
        { status: 400 },
      );
    }

    const formError = validateAdmissionReportRequest(formData);
    if (formError) {
      return NextResponse.json({ error: formError }, { status: 400 });
    }

    const pdfError = validatePdfPayload(pdfBase64, pdfMimeType);
    if (pdfError) {
      return NextResponse.json({ error: pdfError }, { status: 400 });
    }

    const profilePayload = buildProfilePayload(formData);
    const parts = [
      {
        text: buildPrompt(profilePayload, mode || 'form'),
      },
    ];

    if (pdfBase64) {
      parts.push({
        inlineData: {
          mimeType: pdfMimeType || 'application/pdf',
          data: pdfBase64,
        },
        mediaResolution: {
          level: 'media_resolution_medium',
        },
      });
    }

    const client = getGeminiClient();
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
        responseJsonSchema: admissionJsonSchema,
      },
    });

    const text = getGeminiText(result);
    if (result?.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
      return NextResponse.json(
        {
          error:
            'AI response was cut off. Please shorten the profile or try again.',
        },
        { status: 502 },
      );
    }

    const parsed = extractJson(text);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Unable to parse Gemini response.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ data: parsed });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error?.message || 'Something went wrong while generating the report.',
      },
      { status: 500 },
    );
  }
}
