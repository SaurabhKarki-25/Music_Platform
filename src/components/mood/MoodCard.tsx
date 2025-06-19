"use client"
import { useMusic } from "../../context/MusicContext"
import { Play, Music, TrendingUp } from "lucide-react"

interface MoodTemplate {
  _id: string
  name: string
  description: string
  mood: string
  songs: any[]
  usageCount: number
}

interface MoodCardProps {
  mood: MoodTemplate
}

const moodGradients: { [key: string]: string } = {
  happy: "from-yellow-400 to-orange-500",
  sad: "from-blue-400 to-blue-600",
  energetic: "from-red-400 to-pink-500",
  calm: "from-green-400 to-teal-500",
  romantic: "from-pink-400 to-rose-500",
  party: "from-purple-400 to-indigo-500",
  focus: "from-gray-400 to-gray-600",
  relaxing: "from-indigo-400 to-purple-500",
}

const moodEmojis: { [key: string]: string } = {
  happy: "😊",
  sad: "😢",
  energetic: "⚡",
  calm: "😌",
  romantic: "💕",
  party: "🎉",
  focus: "🎯",
  relaxing: "🌙",
}

export default function MoodCard({ mood }: MoodCardProps) {
  const { playSong } = useMusic()

  const handlePlay = () => {
    // In a real app, this would fetch songs for this mood
    console.log(`Playing ${mood.mood} playlist`)
  }

  return (
    <div className="group relative bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${moodGradients[mood.mood] || "from-purple-400 to-pink-500"} opacity-20 rounded-xl`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Mood Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">{moodEmojis[mood.mood] || "🎵"}</div>
          <button
            onClick={handlePlay}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-all duration-200"
          >
            <Play className="w-5 h-5 text-white ml-0.5" />
          </button>
        </div>

        {/* Mood Info */}
        <div className="space-y-2">
          <h3 className="text-white font-bold text-lg capitalize">{mood.name}</h3>
          <p className="text-gray-300 text-sm line-clamp-2">{mood.description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
            <span className="flex items-center space-x-1">
              <Music className="w-3 h-3" />
              <span>50+ songs</span>
            </span>
            <span className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>{mood.usageCount.toLocaleString()} plays</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
    </div>
  )
}
