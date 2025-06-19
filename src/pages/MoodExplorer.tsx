"use client"

import type React from "react"
import { useState } from "react"
import { useQuery } from "react-query"
import { moodAPI } from "../services/api"
import { useMusic } from "../context/MusicContext"
import SongCard from "../components/music/SongCard"
import LoadingSpinner from "../components/common/LoadingSpinner"
import { Sparkles, Music, Heart, Zap, Coffee, Moon } from "lucide-react"

const moodIcons: { [key: string]: React.ReactNode } = {
  happy: <span className="text-2xl">😊</span>,
  sad: <span className="text-2xl">😢</span>,
  energetic: <Zap className="w-6 h-6" />,
  calm: <span className="text-2xl">😌</span>,
  romantic: <Heart className="w-6 h-6" />,
  party: <span className="text-2xl">🎉</span>,
  focus: <Coffee className="w-6 h-6" />,
  relaxing: <Moon className="w-6 h-6" />,
}

const moodColors: { [key: string]: string } = {
  happy: "from-yellow-400 to-orange-500",
  sad: "from-blue-400 to-blue-600",
  energetic: "from-red-400 to-pink-500",
  calm: "from-green-400 to-teal-500",
  romantic: "from-pink-400 to-rose-500",
  party: "from-purple-400 to-indigo-500",
  focus: "from-gray-400 to-gray-600",
  relaxing: "from-indigo-400 to-purple-500",
}

export default function MoodExplorer() {
  const [selectedMood, setSelectedMood] = useState<string>("happy")
  const { playSong } = useMusic()

  const { data: moodTemplates, isLoading: loadingTemplates } = useQuery("moodTemplates", moodAPI.getMoodTemplates)

  const {
    data: moodSongs,
    isLoading: loadingSongs,
    refetch,
  } = useQuery(["moodSongs", selectedMood], () => moodAPI.getSongsByMood(selectedMood), { enabled: !!selectedMood })

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)
    // Update user's mood history
    moodAPI.updateMoodHistory({
      mood,
      songs: moodSongs?.data?.data?.songs?.map((s: any) => s._id) || [],
    })
  }

  const playMoodPlaylist = () => {
    if (moodSongs?.data?.data?.songs?.length > 0) {
      playSong(moodSongs.data.data.songs[0], moodSongs.data.data.songs)
    }
  }

  if (loadingTemplates) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Mood Explorer</h1>
        <p className="text-gray-300 text-lg">Discover music that matches your current vibe</p>
      </div>

      {/* Mood Selection */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Choose Your Mood</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {moodTemplates?.data?.data?.map((template: any) => (
            <button
              key={template._id}
              onClick={() => handleMoodSelect(template.mood)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                selectedMood === template.mood
                  ? "border-purple-400 bg-purple-500/20 scale-105"
                  : "border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20"
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${moodColors[template.mood] || "from-gray-400 to-gray-600"} flex items-center justify-center`}
                >
                  {moodIcons[template.mood] || <Music className="w-6 h-6" />}
                </div>
                <span className="text-white font-semibold capitalize">{template.mood}</span>
                <span className="text-gray-400 text-xs">{template.songs?.length || 0} songs</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Selected Mood Details */}
      {selectedMood && (
        <section>
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-white/10 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white capitalize mb-2">{selectedMood} Vibes</h3>
                <p className="text-gray-300">
                  {moodSongs?.data?.data?.template?.description || `Perfect songs to match your ${selectedMood} mood`}
                </p>
              </div>
              <button
                onClick={playMoodPlaylist}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Music className="w-5 h-5" />
                <span>Play All</span>
              </button>
            </div>
          </div>

          {/* Songs Grid */}
          {loadingSongs ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {moodSongs?.data?.data?.songs?.map((song: any) => (
                <SongCard key={song._id} song={song} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Mood Journey Feature */}
      <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Create a Mood Journey</h3>
        <p className="text-gray-300 mb-4">
          Let us create a seamless transition between different moods for your perfect listening experience.
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm hover:bg-purple-500/30 transition-colors">
            Sad → Happy
          </button>
          <button className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm hover:bg-blue-500/30 transition-colors">
            Calm → Energetic
          </button>
          <button className="bg-pink-500/20 text-pink-300 px-4 py-2 rounded-full text-sm hover:bg-pink-500/30 transition-colors">
            Focus → Relaxing
          </button>
        </div>
      </section>
    </div>
  )
}
