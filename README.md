# CredNews 📰

**CredNews** is a mobile-first news application built with Expo for the **HNG Mobile Stage 3 Task**.
It delivers real-time news, personalized feeds, local tech events, AI-powered summaries, and community-driven fact-checking in a fast, editorial-style interface.

---

# 📱 App Built

**Option B: News App**

CredNews focuses on fast, readable news discovery with a **modern newsroom-inspired interface**, optimized for performance, usability, and reliability.

---

# ✨ Core Features

## 📰 News Feed

- Live news feed powered by **GNews API**
- Category browsing:
  - Top Stories
  - Business
  - Technology
  - World
  - Sports
  - Health

- Nigeria-first configuration using `.env` settings
- Pull-to-refresh with animated skeleton loading
- Smooth rendering using **FlashList**

---

## 🎯 Personalization

- Custom interest selection modal
- Supports:
  - Categories
  - Topics
  - Geographic regions
  - Custom keywords

- Personalized news feed experience

---

## 🔍 Search

- Real-time keyword-based article search
- Loading and empty states
- Bookmark support directly from search results

---

## 📄 Article Details

Each article includes:

- Full article preview
- External source link
- Bookmarking
- Sharing support
- AI-generated summary
- AI-powered Q&A
- Supporting evidence section
- Community comments

---

## ⭐ Saved Articles

- Bookmark articles for later reading
- Offline-friendly storage using AsyncStorage

---

## 📍 Tech Events

- Discover local tech events
- Filters:
  - City
  - Date
  - Event type

- Device location support
- Fallback event discovery using GNews

---

## 🤖 AI Features

Powered by **Google Gemini**:

- 60-second article summaries
- Article-based Q&A system
- Context-aware responses
- Auth-gated access for controlled usage

---

## 🧠 Community Fact-Checking

Users can:

- Add comments
- Tag claims as:
  - FACT
  - FAKE

- Vote on claims
- Submit supporting evidence
- Upload images as verification proof

---

## 🔐 Authentication

Implemented using **Firebase Authentication**:

- Email/password login
- Secure user sessions
- Protected actions (comments, AI, evidence)

---

## 📡 Offline Support

Designed to remain usable without internet:

- Cached news responses
- Saved articles stored locally
- Offline queue for:
  - Comments
  - Votes
  - Evidence uploads

- Automatic retry on reconnection

---

# 🎨 Animation Highlights

- Smooth screen transitions using Expo Router
- Animated feed cards
- Skeleton loading states
- Interactive feedback animations
- Bookmark and upload state transitions

---

# 🏗️ Project Architecture

```text
src/
  api/          API clients (GNews, PredictHQ, Gemini, Firebase)
  app/          Expo Router screens and navigation
  assets/       Icons and images
  components/   Reusable UI components
  config/       Firebase and service configuration
  hooks/        Custom React hooks
  services/     Business logic and caching
  types/        TypeScript models
  utils/        Helper utilities
```

This architecture separates **API logic**, **UI**, and **business workflows** for scalability and maintainability.

---

# 🧰 Technologies & Libraries

- Expo
- Expo Router
- Firebase
- FlashList
- AsyncStorage
- Expo Location
- Expo Image Picker
- Expo Network
- Expo Web Browser
- Google Gemini API
- React Native Keyboard Controller
- Expo Fonts (Inter)

---

# 🌐 APIs Used

- **GNews API** — news headlines and search
- **PredictHQ API** — structured tech event discovery
- **Google Gemini API** — AI summaries and Q&A
- **Firebase Authentication** — user login
- **Cloud Firestore** — comments and voting
- **Firebase Storage** — evidence image uploads

---

# 🔑 Environment Variables

Create `.env` from `.env.example` and restart Expo:

```bash
cp .env.example .env
# or on Windows PowerShell:
# copy .env.example .env
```

Then run the app with `expo start`.

Example `.env`:

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

⚠️ Never commit real API keys to public repositories.

---

# 🔥 Firebase Setup

Enable:

- Authentication (Email/Password)
- Cloud Firestore
- Firebase Storage

Used for:

- Comments
- Voting
- Supporting evidence
- User sessions

---

# 🚀 Getting Started

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

Lint project:

```bash
pnpm lint
```

Run TypeScript checks:

```bash
pnpm exec tsc --noEmit
```

---

# 📱 Screens Implemented

- News Feed
- Events
- Search
- Saved Articles
- Article Details
- Personalization Modal
- Sign In
- Sign Up

---

# 🧪 Offline Caching & Error Handling

- Cached news responses
- Local saved articles
- Offline retry queue
- Network-aware behavior
- Graceful error messages
- Permission handling

---

# 📸 Screenshots / Recordings

Add screenshots before submission:

```text
docs/screenshots/feed.png
docs/screenshots/search.png
docs/screenshots/article-details.png
docs/screenshots/saved.png
docs/screenshots/events.png
```

---

# 📦 Submission Checklist

For HNG submission, include:

- APK file
- Appetize preview link
- GitHub repository link
- Documentation post (LinkedIn / Medium / X)
- Screenshots or screen recording

---

# 🏁 Summary

CredNews demonstrates a **production-ready mobile architecture**, combining **real-time APIs**, **AI-powered features**, **offline reliability**, and **community verification workflows** into a scalable mobile news platform.
