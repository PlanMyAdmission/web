import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PORT = 3101;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SERVER_READY_PATTERN = /Ready in/i;
const SERVER_START_TIMEOUT_MS = 60_000;
const REQUEST_TIMEOUT_MS = 120_000;

let serverProcess = null;
let serverOutput = '';

const getAdminDb = () => {
  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || '';

  if (!projectId) {
    return null;
  }

  const app =
    getApps()[0] ||
    initializeApp({
      credential: applicationDefault(),
      projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

  return getFirestore(app);
};

const waitForServer = async () => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < SERVER_START_TIMEOUT_MS) {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/leads`);
      if (response.status === 401) {
        return;
      }
    } catch (_error) {
      // Server not ready yet.
    }

    if (SERVER_READY_PATTERN.test(serverOutput)) {
      await delay(500);
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for test server.\n${serverOutput}`);
};

const postJson = async (path, body) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  return {
    response,
    payload,
  };
};

before(async () => {
  process.loadEnvFile('.env');

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required for AI smoke tests.');
  }

  serverProcess = spawn(
    'npm',
    ['run', 'dev', '--', '--hostname', '127.0.0.1', '--port', `${PORT}`],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  serverProcess.stdout.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });
  serverProcess.stderr.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });

  await waitForServer();
});

after(async () => {
  if (!serverProcess) {
    return;
  }

  serverProcess.kill('SIGINT');
  await delay(500);

  if (!serverProcess.killed) {
    serverProcess.kill('SIGKILL');
  }
});

test(
  'AI university matchmaker returns structured recommendations',
  { timeout: REQUEST_TIMEOUT_MS },
  async () => {
    const { response, payload } = await postJson('/api/ai/university-match', {
      searchProfile: {
        filledBy: 'student',
        studentName: 'Arnav Gupta',
        contactPreferences: ['Email', 'Call'],
        degreeLevel: 'PG',
        programArea: 'Data Science and AI',
        specialization: 'Machine Learning',
        targetCountries: ['United States'],
        targetIntake: 'Fall 2027',
        careerGoal: 'Machine learning engineer',
        scoreType: 'cgpa10',
        scoreValue: '8.5',
        boardOrUniversity: 'Mumbai University',
        englishTestStatus: 'not-yet',
        englishTestType: '',
        englishTestScore: '',
        budgetAmount: '4000000',
        budgetCurrency: 'INR',
        fundingPlan: 'Self-funded',
        scholarshipNeed: 'High',
        familyPriorityTop3: ['Affordability', 'Safety'],
        riskComfort: 'Balanced',
        query: 'Prefer strong internships and practical programs.',
      },
      pdfBase64: '',
      pdfMimeType: '',
      leadContext: {
        currentUser: {
          uid: null,
          email: null,
          displayName: null,
        },
        formStartedAt: Date.now() - 10_000,
        honeypot: '',
      },
    });

    assert.equal(response.status, 200, JSON.stringify(payload));
    assert.equal(typeof payload?.data?.summary, 'string');
    assert.ok(payload.data.summary.length > 0);
    assert.ok(Array.isArray(payload?.data?.universities));
    assert.ok(payload.data.universities.length > 0);
    assert.ok(Array.isArray(payload?.data?.nextSteps));
  },
);

test(
  'AI essay reviewer returns a normalized review payload',
  { timeout: REQUEST_TIMEOUT_MS },
  async () => {
    const { response, payload } = await postJson('/api/ai/essay-review', {
      reviewForm: {
        documentType: 'statement_of_purpose',
        targetUniversity: 'Stanford University',
        targetProgram: 'MS Computer Science',
        targetCountry: 'USA',
        prompt: 'Why this program?',
        wordLimit: '650',
        applicantContext: 'Indian software engineer applying for Fall 2027.',
        essayText:
          'I want to study computer science because I enjoy building products that solve real problems. During college I led a project for automating lab scheduling and learned how systems thinking can improve everyday life.',
        focusAreas: ['storytelling', 'school_fit'],
      },
      pdfBase64: '',
      pdfMimeType: '',
    });

    assert.equal(response.status, 200, JSON.stringify(payload));
    assert.equal(typeof payload?.data?.overallScore, 'number');
    assert.ok(Array.isArray(payload?.data?.scoreBreakdown));
    assert.ok(Array.isArray(payload?.data?.focusFeedback));
    assert.equal(typeof payload?.data?.coachSummary, 'string');
  },
);

test(
  'AI admission evaluator returns a structured report',
  { timeout: REQUEST_TIMEOUT_MS },
  async () => {
    const { response, payload } = await postJson('/api/ai/admission-report', {
      formData: {
        fullName: 'Arnav',
        lastName: 'Gupta',
        email: 'arnav@example.com',
        targetCountry: 'USA',
        degreeLevel: 'Masters',
        programArea: 'Computer Science',
        fieldOfStudy: 'Artificial Intelligence',
        scoreType: 'CGPA_10',
        scoreValue: '8.5',
        boardOrUniversity: 'Mumbai University',
        englishTest: 'IELTS',
        englishScore: '7.5',
        aptitudeTest: 'GRE',
        aptitudeScore: '320',
        budgetCurrency: 'INR',
        budgetAmount: '4000000',
        budgetIncludes: 'tuition_living',
        fundingPlan: 'Family funds',
        targetIntake: 'Fall 2027',
        applicationStage: 'Shortlisting',
        deadlineUrgency: 'Moderate',
        workExperienceMonths: '24',
        gpa: '',
        testScores: '',
        budget: '',
        timeline: '',
        workExperience: 'Software engineer for 2 years',
        extracurriculars: 'Hackathons',
        notes: 'Interested in AI and product engineering',
      },
      mode: 'form',
      pdfBase64: '',
      pdfMimeType: '',
    });

    assert.equal(response.status, 200, JSON.stringify(payload));
    assert.equal(typeof payload?.data?.summary, 'string');
    assert.ok(Array.isArray(payload?.data?.strengths));
    assert.ok(Array.isArray(payload?.data?.risks));
    assert.ok(Array.isArray(payload?.data?.recommendedPrograms));
    assert.equal(typeof payload?.data?.score, 'string');
  },
);

test(
  'AI chatbot returns a text response and persists the session',
  { timeout: REQUEST_TIMEOUT_MS },
  async () => {
    const sessionId = `chat_smoke_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const { response, payload } = await postJson('/api/ai/chatbot', {
      sessionId,
      messages: [
        {
          id: `${sessionId}_user_1`,
          role: 'user',
          createdAt: new Date().toISOString(),
          content:
            'I have CGPA 8.5, IELTS 7.5, and a 40 lakh INR budget. Should I look at USA or Canada first?',
        },
      ],
      metadata: {
        pagePath: '/contact',
        locale: 'en-IN',
        timezone: 'Asia/Kolkata',
        userAgent: 'smoke-test-agent',
      },
    });

    assert.equal(response.status, 200, JSON.stringify(payload));
    assert.equal(typeof payload?.data?.message, 'string');
    assert.ok(payload.data.message.length > 0);
    assert.equal(payload?.data?.sessionId, sessionId);
    assert.equal(payload?.data?.assistantMessage?.role, 'bot');
    assert.equal(typeof payload?.data?.assistantMessage?.content, 'string');
    assert.ok(!/digiiq|ceronica/i.test(payload.data.message));

    const db = getAdminDb();
    if (!db) {
      return;
    }

    const sessionDoc = await db.collection('chatbot_sessions').doc(sessionId).get();
    assert.equal(sessionDoc.exists, true);

    const sessionData = sessionDoc.data() || {};
    assert.equal(sessionData.sessionId, sessionId);
    assert.equal(sessionData.sourcePage, '/contact');
    assert.ok(Array.isArray(sessionData.messages));
    assert.ok(sessionData.messages.length >= 2);
    assert.equal(sessionData.messages[0]?.role, 'user');
    assert.equal(sessionData.messages.at(-1)?.role, 'bot');
  },
);
