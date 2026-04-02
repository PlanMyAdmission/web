import { NextResponse } from 'next/server';
import {
  buildEssayReviewPrompt,
  essayReviewJsonSchema,
  normalizeEssayReviewResult,
} from '@lib/ai/essayReview.js';
import { getGeminiClient, extractJson, getGeminiText } from '@lib/ai/gemini.js';
import {
  enforceRequestRateLimit,
  validateEssayReviewRequest,
  validatePdfPayload,
} from '@lib/ai/requestGuards.js';

export async function POST(request) {
  try {
    const requestPolicyError = await enforceRequestRateLimit({
      request,
      routeKey: 'ai:essay-review',
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

    const { reviewForm, pdfBase64, pdfMimeType } = await request.json();

    if (!reviewForm || typeof reviewForm !== 'object') {
      return NextResponse.json(
        { error: 'Missing essay review form data.' },
        { status: 400 },
      );
    }

    const requestError = validateEssayReviewRequest(reviewForm);
    if (requestError) {
      return NextResponse.json({ error: requestError }, { status: 400 });
    }

    const pdfError = validatePdfPayload(pdfBase64, pdfMimeType);
    if (pdfError) {
      return NextResponse.json({ error: pdfError }, { status: 400 });
    }

    const hasEssayText = Boolean(`${reviewForm.essayText || ''}`.trim());

    if (!hasEssayText && !pdfBase64) {
      return NextResponse.json(
        { error: 'Paste your draft or upload a PDF to review.' },
        { status: 400 },
      );
    }

    const mode = pdfBase64 ? (hasEssayText ? 'hybrid' : 'pdf') : 'text';

    const parts = [
      {
        text: buildEssayReviewPrompt(reviewForm, mode),
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
        responseJsonSchema: essayReviewJsonSchema,
      },
    });

    const text = getGeminiText(result);
    if (result?.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
      return NextResponse.json(
        {
          error:
            'AI response was cut off. Please shorten the draft or try again.',
        },
        { status: 502 },
      );
    }

    const parsed = extractJson(text);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Unable to parse AI review. Please retry.' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      data: normalizeEssayReviewResult(parsed),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Something went wrong while reviewing the essay draft.',
      },
      { status: 500 },
    );
  }
}
