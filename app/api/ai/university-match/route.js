import { NextResponse } from 'next/server';
import {
  extractJson,
  generateStructuredGeminiContent,
  getGeminiText,
} from '@/lib/ai/gemini.js';

import {
  buildUniversityPrompt,
  universityJsonSchema,
} from '@/lib/ai/universityMatch.js';

export async function POST(request) {
  try {
    const { searchProfile, pdfBase64, pdfMimeType } = await request.json();

    if (!searchProfile || typeof searchProfile !== 'object') {
      return NextResponse.json(
        { error: 'Missing search profile.' },
        { status: 400 },
      );
    }

    const mode = pdfBase64 ? 'pdf' : 'search';
    const parts = [
      {
        text: buildUniversityPrompt(mode, searchProfile),
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
      schema: universityJsonSchema,
    });

    const rawText = await getGeminiText(result);
    if (result?.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
      return NextResponse.json(
        {
          error:
            'AI response was cut off. Please shorten the profile or try again.',
        },
        { status: 502 },
      );
    }

    const parsed = extractJson(rawText);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Unable to parse AI response. Please retry.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ data: parsed });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error?.message || 'Something went wrong while generating results.',
      },
      { status: 500 },
    );
  }
}
