# CredNews

CredNews is a mobile-first Expo news application built for the HNG Mobile Stage 3 task. It consumes live news APIs, supports personalized feeds, article search, saved articles, local tech events, AI-assisted article summaries/Q&A, and community fact-checking with Firebase-backed comments and evidence.

## App Built

**Option B: News App**

CredNews focuses on fast, readable news discovery with a dark editorial interface inspired by a newsroom/live-wire visual style.

## Features

- **Live news feed** with category browsing for Top Stories, Business, Technology, World, Sports, and Health.
- **Nigeria-first news configuration** using GNews country/language settings from `.env`.
- **Personalized interests** through a modal where users select categories, topics, geography, and custom interests.
- **Pull-to-refresh** on the main feed with skeleton loading.
- **Smooth list rendering** with `FlashList`.
- **Article search** with real-time keyword search, loading states, empty states, and bookmark support.
- **Article details screen** with source link, sharing, bookmarking, AI brief, AI Q&A, supporting evidence, and community comments.
- **Saved articles** page backed by local storage for offline reading.
- **Tech events screen** for Lagos/Nigeria/Africa-focused event discovery with city filters, date/type filters, device location lookup, and GNews fallback.
- **Firebase authentication** for comment, evidence, and AI Q&A gated flows.
- **Community fact-checking** with comments, FACT/FAKE tags, and real/fake voting.
- **Supporting evidence** with link, note, and image submissions.
- **Offline-friendly pending actions** for comments, votes, and evidence when connectivity fails.
- **Gemini AI integration** for 60-second article briefs and article-grounded Q&A.
- **Global Inter font setup** through Expo fonts.
- **Responsive scaling helpers** in `src/utils/scaling.ts`.
- **Animated screen transitions** through Expo Router stack options.
- **Animated list/card entrances** and skeleton loaders.

## APIs Used

- [GNews API](https://gnews.io/) for news headlines and search.
- [PredictHQ API](https://www.predicthq.com/) for structured event discovery when configured.
- [Google Gemini API](https://ai.google.dev/) for AI summaries and article Q&A.
- [Firebase Authentication](https://firebase.google.com/products/auth) for account/session support.
- [Cloud Firestore](https://firebase.google.com/products/firestore) for comments, votes, and evidence metadata.
- [Firebase Storage](https://firebase.google.com/products/storage) for image evidence uploads.

## Animation Highlights

- **Screen transitions:** Expo Router stack screens use fade, slide-from-right, and slide-from-bottom transitions.
- **Feed/list item animation:** feed cards, search results, and saved articles animate into view with opacity and vertical translation.
- **Skeleton loading:** feed and search states show animated loading placeholders.
- **Interactive UI states:** bookmark, auth-gated actions, AI loading, evidence upload, and comment submission provide visible state changes.

## Architecture

```text
src/
  api/          API clients for GNews, PredictHQ, Gemini, Firestore, and Storage
  app/          Expo Router screens, tabs, modals, auth, and article routes
  assets/       Icons and visual assets
  components/   Reusable UI: headers, cards, chips, AI/community/evidence panels
  config/       Firebase, Firestore, and Storage setup
  hooks/        App-level hooks such as auth/network wrappers
  services/     Business logic, caching, API orchestration, pending actions
  types/        TypeScript domain models
  utils/        Env parsing, scaling, typography, date, navigation, async helpers
```

The app keeps API access in `src/api`, business workflows in `src/services`, and reusable presentation components in `src/components`.

## Important Libraries

- `expo` and `expo-router`
- `@shopify/flash-list`
- `@react-native-async-storage/async-storage`
- `firebase`
- `rn-swiftauth-sdk`
- `expo-image`
- `expo-image-picker`
- `expo-location`
- `expo-network`
- `expo-web-browser`
- `@expo-google-fonts/inter`
- `react-native-keyboard-controller`

## Environment Variables

Create a `.env` file from `.env.example`:

```env
EXPO_PUBLIC_NEWS_API_BASE_URL=https://gnews.io/api/v4
EXPO_PUBLIC_NEWS_API_KEY=your_gnews_api_key
EXPO_PUBLIC_NEWS_DEFAULT_COUNTRY=ng
EXPO_PUBLIC_NEWS_DEFAULT_LANGUAGE=en
EXPO_PUBLIC_NEWS_MAX_RESULTS=20

EXPO_PUBLIC_EVENTS_API_BASE_URL=https://api.predicthq.com/v1
EXPO_PUBLIC_PREDICTHQ_API_KEY=your_predicthq_api_key

EXPO_PUBLIC_GEMINI_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_GEMINI_MODEL=gemini-2.5-flash

EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Do not commit real API keys in public repositories.

## Firebase Setup

Enable these Firebase products:

- Authentication with Email/Password provider
- Cloud Firestore
- Firebase Storage

Recommended development Firestore rules:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{articleId}/comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if false;

      match /voters/{uid} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }

    match /articles/{articleId}/evidence/{evidenceId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && resource.data.authorUid == request.auth.uid;
      allow update: if false;
    }

    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Recommended development Storage rules:

```js
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /evidence/{articleId}/{uid}/{fileName} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow delete: if request.auth != null && request.auth.uid == uid;
      allow update: if false;
    }
  }
}
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start Expo:

```bash
pnpm start
```

Run Android:

```bash
pnpm android
```

Run iOS:

```bash
pnpm ios
```

Run lint:

```bash
pnpm lint
```

Run TypeScript checks:

```bash
pnpm exec tsc --noEmit
```

## Screens Implemented

- Feeds
- Events
- Search
- Saved Articles
- Article Details
- Personalize Interests modal
- Sign In
- Sign Up

## Offline Caching and Error Handling

- News responses are cached with AsyncStorage.
- Saved articles are stored locally.
- Comments, votes, and evidence actions can be queued for retry.
- Network state is checked with `expo-network`.
- User-facing retry/error messages are shown for API failures, rate limits, offline states, denied permissions, and failed cloud sync.

## Screenshots / Recordings

Add your screenshots or GIFs here before submission:

```text
docs/screenshots/feed.png
docs/screenshots/search.png
docs/screenshots/article-details.png
docs/screenshots/saved.png
docs/screenshots/events.png
```

## Submission Notes

For HNG submission, include:

- Appetize preview link
- GitHub repository link
- LinkedIn/X/Medium documentation post link
- Screenshots or a screen recording/GIF
