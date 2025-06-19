"use client"
import { useAuth } from "../context/AuthContext"
import { useMusic } from "../context/MusicContext"
import SongCard from "../components/music/SongCard"
import MoodCard from "../components/mood/MoodCard"
import { Play, TrendingUp, Clock, Heart, Sparkles, Music2, Users, Headphones } from "lucide-react"

// Mock data for demo
const mockMoodTemplates = [
  {
    _id: "1",
    name: "Morning Motivation",
    description: "Start your day with energy and positivity",
    mood: "energetic",
    songs: [],
    usageCount: 1250,
  },
  {
    _id: "2",
    name: "Focus Flow",
    description: "Perfect background music for deep work",
    mood: "focus",
    songs: [],
    usageCount: 890,
  },
  {
    _id: "3",
    name: "Chill Vibes",
    description: "Relax and unwind with these calm tracks",
    mood: "calm",
    songs: [],
    usageCount: 2100,
  },
]

const mockTrendingSongs = [
  {
    _id: "1",
    title: "Sunset Dreams",
    artist: "Luna Wave",
    album: "Ethereal Nights",
    duration: 245,
    audioUrl: "/placeholder-audio.mp3",
    coverImage: "/placeholder.svg?height=300&width=300",
    moodTags: ["calm", "romantic"],
    plays: 125000,
    likes: 8500,
  },
  {
    _id: "2",
    title: "Electric Pulse",
    artist: "Neon Beats",
    album: "Digital Dreams",
    duration: 198,
    audioUrl: "/placeholder-audio.mp3",
    coverImage: "/placeholder.svg?height=300&width=300",
    moodTags: ["energetic", "party"],
    plays: 89000,
    likes: 6200,
  },
  {
    _id: "3",
    title: "Morning Coffee",
    artist: "Jazz Collective",
    album: "Daily Rituals",
    duration: 312,
    audioUrl: "/placeholder-audio.mp3",
    coverImage: "/placeholder.svg?height=300&width=300",
    moodTags: ["calm", "focus"],
    plays: 156000,
    likes: 12000,
  },
  {
    _id: "4",
    title: "Dance Revolution",
    artist: "Beat Masters",
    album: "Club Anthems",
    duration: 223,
    audioUrl: "/placeholder-audio.mp3",
    coverImage: "/placeholder.svg?height=300&width=300",
    moodTags: ["party", "energetic"],
    plays: 234000,
    likes: 18500,
  },
]

const mockRecentSongs = [
  {
    song: mockTrendingSongs[0],
    playedAt: new Date(),
  },
  {
    song: mockTrendingSongs[1],
    playedAt: new Date(),
  },
  {
    song: mockTrendingSongs[2],
    playedAt: new Date(),
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { playSong } = useMusic()

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-white/10 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.username}! 🎵</h1>
            <p className="text-gray-300">Ready to discover your perfect mood soundtrack?</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Songs Played</p>
              <p className="text-2xl font-bold text-white">1,247</p>
              <p className="text-green-400 text-xs">+12% this week</p>
            </div>
            <Play className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Favorite Genre</p>
              <p className="text-lg font-semibold text-white">{user?.profile?.favoriteGenres?.[0] || "Electronic"}</p>
              <p className="text-blue-400 text-xs">Most played</p>
            </div>
            <Music2 className="w-8 h-8 text-pink-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Following</p>
              <p className="text-2xl font-bold text-white">{user?.following?.length || 0}</p>
              <p className="text-purple-400 text-xs">Artists & Friends</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Listening Time</p>
              <p className="text-2xl font-bold text-white">24.5h</p>
              <p className="text-orange-400 text-xs">This month</p>
            </div>
            <Headphones className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Mood Recommendations */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
            Your Mood Playlists
          </h2>
          <button className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockMoodTemplates.map((mood) => (
            <MoodCard key={mood._id} mood={mood} />
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-400" />
            Recently Played
          </h2>
          <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">View History</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockRecentSongs.map((item, index) => (
            <SongCard key={`recent-${index}`} song={item.song} />
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-orange-400" />
            Trending Now
          </h2>
          <button className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">See More</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockTrendingSongs.map((song) => (
            <SongCard key={song._id} song={song} />
          ))}
        </div>
      </section>

      {/* Discover New Music */}
      <section className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl p-6 border border-white/10 backdrop-blur-lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Discover Your Next Favorite</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Let our AI-powered mood engine find the perfect songs that match your current vibe and musical taste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
              Explore Moods
            </button>
            <button className="bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20">
              Surprise Me
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
