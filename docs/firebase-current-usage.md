# Firebase Current Usage

This document describes how Firebase is currently used in this codebase (`planmy admission`) as of February 23, 2026.

## 1) Services currently in use

- Firebase App initialization (`firebase/app`)
- Firebase Authentication (`firebase/auth`)
- Cloud Firestore (`firebase/firestore`)
- Firebase Storage (`firebase/storage`)

Not actively used in app code right now:
- Realtime Database (only `databaseURL` exists in config; no database SDK usage found)
- Cloud Functions SDK (`firebase/functions`)
- Analytics/Messaging/Remote Config/Performance SDK usage

## 2) Initialization and config

Primary setup is in `lib/firebase.js`.

- Initializes app once with env-based config.
- Exports shared instances:
  - `auth`
  - `db`
  - `storage`
  - default `app`

Expected env vars:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Dependency version:
- `firebase@^9.17.1` in `package.json`

## 3) Authentication usage

Implemented in `context/AuthProvider.jsx`.

Flows:
- Email/password signup (`createUserWithEmailAndPassword`)
- Email/password login (`signInWithEmailAndPassword`)
- Google OAuth popup login (`GoogleAuthProvider`, `signInWithPopup`)
- Logout (`signOut`)
- Session persistence is set to `browserSessionPersistence`
- Auth state tracking via `onAuthStateChanged`

User bootstrap behavior:
- On signup: creates Firestore user doc `users/{uid}` with basic fields.
- On first Google login: creates `users/{uid}` if missing.

## 4) Firestore usage

### Primary writable collection

`users/{uid}` (from `AuthProvider`)

Written fields include:
- Identity/profile basics: `uid`, `email`, `userName`, `phoneNumber`, `createdAt`
- Profile form data: `firstName`, `lastName`, `gender`, `date_of_Birth`, `nationality`, `address`, `country`, `state`, `city`, `zipCode`
- Profile photo: `photoURL`
- Arrays via `arrayUnion`:
  - `education[]`
  - `experience[]`
  - `test_score[]`
  - `documents[]` (with file URL + date)
  - `favorites[]` (shortlisted university ids)
- Recommendation inputs: `filterDetails`

Read behavior:
- Real-time subscription to current user doc via `onSnapshot` in `AuthProvider`.

Delete behavior:
- Generic remove helper rewrites full array field after filtering by `id` (`handleDocumentDelete`).

### Read-only/reference collections used in UI

- `location`
  - Used in profile forms (`About`, `Experience`) for country/state/city pickers.
- `degrees`
  - Used in recommendations/education forms.
- `disciplines`
  - Used in recommendations/education/experience forms.
- `countries_state`
  - Used in recommendations flow (`RecommandationsMain`).
- `university_info`
  - Used in recommendation results, shortlisted list, and university navigator course lookup.
- `university_desc`
  - Used to fetch university metadata/details by `slug`.
- `explore_university`
  - Used in Explore flow (`FilteredResponse` + `fetchFilteredDocs.js`) with combinational filtering queries.

Firestore query patterns found:
- `where(..., '==', ...)`
- `where(..., 'in', batch)` with chunking in groups of 10
- `where(..., 'array-contains', ...)`
- range filters (`>=`, `<`) for intake/name/university prefix logic
- `limit(...)` used on multiple queries

## 5) Storage usage

Storage is used for:
- Profile images:
  - path: `profile_pictures/{uid}.{ext}`
  - upload + URL retrieval
- User documents:
  - path: `documents/{uid}_{docname}`
  - upload + URL retrieval, then URL stored in Firestore
- Explore university logos:
  - read-only URL lookup from path `logos/{UniversityId}.png`

Also present:
- Static Firebase Storage CDN links are hardcoded for success-story videos in `components/home/SuccessStories.jsx`.

## 6) Hosting/deployment config related to Firebase

`firebase.json` contains Firebase Hosting config:
- site: `planmyadmission`
- public dir: `build`
- SPA rewrite to `/index.html`

Note: this repo is Next.js-based (`next` scripts), so this hosting config may be legacy or used only in a separate deployment path.

## 7) Known gaps / risks observed

- `Shortlisted.jsx` calls `getCurrentUserData()` from `useAuth`, but `AuthProvider` does not expose that function. This is likely stale code or a missing context method.
- `lib/firebase.js` includes `databaseURL` and `measurementId`, but no Realtime DB/Analytics usage appears in app code.
- Many Firestore operations run directly from client components, so effective access control depends heavily on Firebase Security Rules.

## 8) Key Firebase files

- `lib/firebase.js`
- `context/AuthProvider.jsx`
- `components/dashboard/user/profile/About.jsx`
- `components/dashboard/user/profile/Education.jsx`
- `components/dashboard/user/profile/Experience.jsx`
- `components/dashboard/user/profile/Test_Scores.jsx`
- `components/dashboard/user/profile/RecommandationsMain.jsx`
- `components/dashboard/user/profile/Universities.jsx`
- `components/dashboard/user/profile/Shortlisted.jsx`
- `components/explore_university/FilteredResponse.jsx`
- `components/explore_university/filteredResponse/fetchFilteredDocs.js`
- `components/explore_university/Universities/Navigator.jsx`
- `components/dashboard/user/Documents.jsx`
- `firebase.json`
