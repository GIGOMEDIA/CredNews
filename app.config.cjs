require('dotenv').config();

module.exports = ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,

    name: "NEWSROOM",
    slug: "newsroom-app-new",
    projectId: "16b91f2e-1304-443c-90de-e21969cad6bb",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/logo.png",
    scheme: "newsroom",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "NEWSROOM uses your location to find nearby tech events.",
        NSPhotoLibraryUsageDescription:
          "NEWSROOM needs access to your photos so you can attach images as supporting evidence.",
        NSPhotoLibraryAddUsageDescription:
          "NEWSROOM saves images you submit as evidence.",
        NSCameraUsageDescription:
          "NEWSROOM uses the camera so you can capture supporting evidence.",
      },
    },

    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./src/assets/images/logo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.acuop.newsroomappnew",
    },

    plugins: [
      "expo-router",
      "expo-splash-screen",
      "@react-native-google-signin/google-signin",
    ],

    extra: {
      EXPO_PUBLIC_NEWS_API_BASE_URL: process.env.EXPO_PUBLIC_NEWS_API_BASE_URL,
      EXPO_PUBLIC_NEWS_API_KEY: process.env.EXPO_PUBLIC_NEWS_API_KEY,
      EXPO_PUBLIC_NEWS_DEFAULT_COUNTRY:
        process.env.EXPO_PUBLIC_NEWS_DEFAULT_COUNTRY,
      EXPO_PUBLIC_NEWS_DEFAULT_LANGUAGE:
        process.env.EXPO_PUBLIC_NEWS_DEFAULT_LANGUAGE,
      EXPO_PUBLIC_NEWS_MAX_RESULTS: process.env.EXPO_PUBLIC_NEWS_MAX_RESULTS,

      EXPO_PUBLIC_EVENTS_API_BASE_URL:
        process.env.EXPO_PUBLIC_EVENTS_API_BASE_URL,
      EXPO_PUBLIC_PREDICTHQ_API_KEY: process.env.EXPO_PUBLIC_PREDICTHQ_API_KEY,

      EXPO_PUBLIC_GEMINI_API_BASE_URL:
        process.env.EXPO_PUBLIC_GEMINI_API_BASE_URL,
      EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      EXPO_PUBLIC_GEMINI_MODEL: process.env.EXPO_PUBLIC_GEMINI_MODEL,

      EXPO_PUBLIC_GROQ_API_BASE_URL: process.env.EXPO_PUBLIC_GROQ_API_BASE_URL,
      EXPO_PUBLIC_GROQ_API_KEY: process.env.EXPO_PUBLIC_GROQ_API_KEY,
      EXPO_PUBLIC_GROQ_MODEL: process.env.EXPO_PUBLIC_GROQ_MODEL,

      EXPO_PUBLIC_CEREBRAS_API_BASE_URL:
        process.env.EXPO_PUBLIC_CEREBRAS_API_BASE_URL,
      EXPO_PUBLIC_CEREBRAS_API_KEY: process.env.EXPO_PUBLIC_CEREBRAS_API_KEY,
      EXPO_PUBLIC_CEREBRAS_MODEL: process.env.EXPO_PUBLIC_CEREBRAS_MODEL,

      EXPO_PUBLIC_OPENROUTER_API_BASE_URL:
        process.env.EXPO_PUBLIC_OPENROUTER_API_BASE_URL,
      EXPO_PUBLIC_OPENROUTER_API_KEY:
        process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
      EXPO_PUBLIC_OPENROUTER_MODEL: process.env.EXPO_PUBLIC_OPENROUTER_MODEL,

      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:
        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
        process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    },
  },
});
