import Constants from "expo-constants";

type Extra = Record<string, string | undefined>;

const extra: Extra =
  (Constants.expoConfig?.extra as Extra) ??
  ((Constants.manifest as any)?.extra as Extra) ??
  {};

// Get env from Expo config OR process.env
const getEnv = (key: string): string | undefined => {
  if (extra?.[key]) return extra[key];
  if (process.env?.[key]) return process.env[key];
  return undefined;
};

// Throw error if missing (prevents silent bugs)
const required = (value: string | undefined, name: string): string => {
  if (!value || value.trim() === "") {
    console.error(`❌ Missing ENV: ${name}`);
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const env = {
  // ======================
  // 📰 NEWS API (REQUIRED)
  // ======================
  apiBaseUrl:
    getEnv("EXPO_PUBLIC_NEWS_API_BASE_URL") ??
    "https://gnews.io/api/v4",

  apiKey: required(
    getEnv("EXPO_PUBLIC_NEWS_API_KEY"),
    "EXPO_PUBLIC_NEWS_API_KEY"
  ),

  defaultCountry:
    getEnv("EXPO_PUBLIC_NEWS_DEFAULT_COUNTRY") ?? "ng",

  defaultLanguage:
    getEnv("EXPO_PUBLIC_NEWS_DEFAULT_LANGUAGE") ?? "en",

  maxResults: Number(
    getEnv("EXPO_PUBLIC_NEWS_MAX_RESULTS") ?? "20"
  ),

  // ======================
  // 🔥 FIREBASE (REQUIRED)
  // ======================
  firebaseApiKey: required(
    getEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
    "EXPO_PUBLIC_FIREBASE_API_KEY"
  ),

  firebaseAuthDomain: required(
    getEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"
  ),

  firebaseProjectId: required(
    getEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID"
  ),

  firebaseStorageBucket: required(
    getEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"
  ),

  firebaseMessagingSenderId: required(
    getEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  ),

  firebaseAppId: required(
    getEnv("EXPO_PUBLIC_FIREBASE_APP_ID"),
    "EXPO_PUBLIC_FIREBASE_APP_ID"
  ),

  // ======================
  // 📅 EVENTS (OPTIONAL)
  // ======================
  eventsApiBaseUrl:
    getEnv("EXPO_PUBLIC_EVENTS_API_BASE_URL") ??
    "https://api.predicthq.com/v1",

  predicthqApiKey:
    getEnv("EXPO_PUBLIC_PREDICTHQ_API_KEY") ?? "",

  // ======================
  // 🤖 AI PROVIDERS (OPTIONAL)
  // ======================
  geminiApiBaseUrl:
    getEnv("EXPO_PUBLIC_GEMINI_API_BASE_URL") ?? "",
  geminiApiKey:
    getEnv("EXPO_PUBLIC_GEMINI_API_KEY") ?? "",
  geminiModel:
    getEnv("EXPO_PUBLIC_GEMINI_MODEL") ?? "",

  groqApiBaseUrl:
    getEnv("EXPO_PUBLIC_GROQ_API_BASE_URL") ?? "",
  groqApiKey:
    getEnv("EXPO_PUBLIC_GROQ_API_KEY") ?? "",
  groqModel:
    getEnv("EXPO_PUBLIC_GROQ_MODEL") ?? "",

  cerebrasApiBaseUrl:
    getEnv("EXPO_PUBLIC_CEREBRAS_API_BASE_URL") ?? "",
  cerebrasApiKey:
    getEnv("EXPO_PUBLIC_CEREBRAS_API_KEY") ?? "",
  cerebrasModel:
    getEnv("EXPO_PUBLIC_CEREBRAS_MODEL") ?? "",

  openrouterApiBaseUrl:
    getEnv("EXPO_PUBLIC_OPENROUTER_API_BASE_URL") ?? "",
  openrouterApiKey:
    getEnv("EXPO_PUBLIC_OPENROUTER_API_KEY") ?? "",
  openrouterModel:
    getEnv("EXPO_PUBLIC_OPENROUTER_MODEL") ?? "",
};