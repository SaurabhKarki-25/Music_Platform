export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
}

export const APP_CONFIG = {
  NAME: process.env.REACT_APP_APP_NAME || "Mood Harmony",
  VERSION: process.env.REACT_APP_VERSION || "1.0",
  DESCRIPTION: "Your perfect mood-based music streaming platform",
  TAGLINE: "Experience music that matches your soul",
  FEATURES: [
    "🎭 Mood-Based Playlists",
    "🎵 High-Quality Audio",
    "📱 Cross-Platform",
    "🤖 AI Recommendations",
    "🎨 Beautiful Interface",
  ],
}

export const MOOD_COLORS = {
  happy: "from-yellow-400 to-orange-500",
  sad: "from-blue-400 to-blue-600",
  energetic: "from-red-400 to-pink-500",
  calm: "from-green-400 to-teal-500",
  romantic: "from-pink-400 to-rose-500",
  party: "from-purple-400 to-indigo-500",
  focus: "from-gray-400 to-gray-600",
  relaxing: "from-indigo-400 to-purple-500",
  motivational: "from-orange-400 to-red-500",
  nostalgic: "from-amber-400 to-yellow-500",
}

export const MOOD_EMOJIS = {
  happy: "😊",
  sad: "😢",
  energetic: "⚡",
  calm: "😌",
  romantic: "💕",
  party: "🎉",
  focus: "🎯",
  relaxing: "🌙",
  motivational: "💪",
  nostalgic: "🌅",
}

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/moodharmony",
  instagram: "https://instagram.com/moodharmony",
  facebook: "https://facebook.com/moodharmony",
  discord: "https://discord.gg/moodharmony",
}
