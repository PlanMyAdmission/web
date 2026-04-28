import { NextResponse } from 'next/server';
import {
  buildEssayReviewPrompt,
  essayReviewJsonSchema,
  normalizeEssayReviewResult,
} from '@/lib/ai/essayReview.js';
import {
  extractJson,
  generateStructuredGeminiContent,
  getGeminiText,
} from '@/lib/ai/gemini.js';

export async function POST(request) {
  try {
    const { reviewForm, pdfBase64, pdfMimeType } = await request.json();

    if (!reviewForm || typeof reviewForm !== 'object') {
      return NextResponse.json(
        { error: 'Missing essay review form data.' },
        { status: 400 },
      );
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

    const { result } = await generateStructuredGeminiContent({
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      schema: essayReviewJsonSchema,
    });

    const text = await getGeminiText(result);
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
