import { existsSync } from 'node:fs';
import process from 'node:process';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const usage = `
Grant admin access to a Firebase user.

Usage:
  npm run admin:grant -- --email you@example.com
  npm run admin:grant -- --uid FIREBASE_UID --email you@example.com

Notes:
  - Requires Firebase Admin credentials in the environment or .env/.env.local.
  - If you use --email only, the Firebase Auth user must already exist.
`;

const normalizeEmail = (value) => `${value || ''}`.trim().toLowerCase();

const loadEnvFiles = () => {
  for (const fileName of ['.env.local', '.env']) {
    if (existsSync(fileName)) {
      process.loadEnvFile(fileName);
    }
  }
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  let email = '';
  let uid = '';

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--help' || arg === '-h') {
      console.log(usage.trim());
      process.exit(0);
    }

    if (arg === '--email') {
      email = normalizeEmail(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--uid') {
      uid = `${args[index + 1] || ''}`.trim();
      index += 1;
      continue;
    }
  }

  return { email, uid };
};

const getCredential = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return cert({
      projectId,
      clientEmail,
      privateKey,
    });
  }

  if (
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.FIREBASE_CONFIG
  ) {
    return applicationDefault();
  }

  throw new Error(
    'Firebase Admin credentials are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY, or configure application default credentials.',
  );
};

const getAdminApp = () =>
  getApps().find((app) => app.name === 'admin-grant-script') ||
  initializeApp({ credential: getCredential() }, 'admin-grant-script');

const resolveTargetUser = async ({ auth, email, uid }) => {
  if (uid) {
    const user = await auth.getUser(uid).catch(() => null);
    return {
      uid,
      email: normalizeEmail(email || user?.email),
    };
  }

  if (!email) {
    throw new Error('Provide --email or --uid.\n\n' + usage.trim());
  }

  try {
    const user = await auth.getUserByEmail(email);
    return {
      uid: user.uid,
      email: normalizeEmail(user.email || email),
    };
  } catch (error) {
    if (error?.code === 'auth/user-not-found') {
      throw new Error(
        `No Firebase Auth user exists for ${email}. Sign in once with Google at /admin/login first, then run this command again.`,
      );
    }

    throw error;
  }
};

const main = async () => {
  const { email, uid } = parseArgs();
  loadEnvFiles();

  const app = getAdminApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const targetUser = await resolveTargetUser({ auth, email, uid });

  await db.collection('admin_users').doc(targetUser.uid).set(
    {
      email: targetUser.email,
      role: 'admin',
      active: true,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`Admin access granted for ${targetUser.email || targetUser.uid}`);
  console.log(`Firestore document: admin_users/${targetUser.uid}`);
};

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
