import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import { getGeminiClient, extractJson, getGeminiText } from '@lib/ai/gemini.js';
import {
  enforceAiRequestPolicy,
  validateLeadCaptureContext,
  validatePdfPayload,
  validateUniversityMatchRequest,
} from '@lib/ai/requestGuards.js';
import {
  buildUniversityPrompt,
  universityJsonSchema,
} from '@lib/ai/universityMatch.js';
import {
  getFirebaseAdminDb,
  isFirebaseAdminConfigured,
} from '@lib/firebaseAdmin.js';
import { buildLeadPayload } from '@lib/leadPayload.js';
import { reportError } from '@lib/logger.js';

export async function POST(request) {
  try {
    const requestPolicyError = await enforceAiRequestPolicy({
      request,
      routeKey: 'ai:university-match',
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

    const { searchProfile, pdfBase64, pdfMimeType, leadContext } =
      await request.json();

    if (!searchProfile || typeof searchProfile !== 'object') {
      return NextResponse.json(
        { error: 'Missing search profile.' },
        { status: 400 },
      );
    }

    const profileError = validateUniversityMatchRequest(searchProfile);
    if (profileError) {
      return NextResponse.json({ error: profileError }, { status: 400 });
    }

    const pdfError = validatePdfPayload(pdfBase64, pdfMimeType);
    if (pdfError) {
      return NextResponse.json({ error: pdfError }, { status: 400 });
    }

    const leadContextError = validateLeadCaptureContext(leadContext);
    if (leadContextError) {
      return NextResponse.json({ error: leadContextError }, { status: 400 });
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
        responseJsonSchema: universityJsonSchema,
      },
    });

    const rawText = getGeminiText(result);
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

    if (isFirebaseAdminConfigured) {
      try {
        const db = getFirebaseAdminDb();
        await db.collection('ai_matchmaker_leads').add({
          ...buildLeadPayload({
            currentUser: leadContext?.currentUser || null,
            searchProfile,
            parsedResults: parsed,
            hasProfilePdf: Boolean(pdfBase64),
          }),
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch (leadError) {
        reportError('Failed to save AI matchmaker lead:', leadError);
      }
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
