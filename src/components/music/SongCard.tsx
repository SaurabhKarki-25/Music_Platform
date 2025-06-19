"use client"
import { useState } from "react"
import type React from "react"

import { useMusic } from "../../context/MusicContext"
import { Play, Pause, Heart, MoreHorizontal, Plus } from "lucide-react"

interface Song {
  _id: string
  title: string
  artist: string
  album: string
  duration: number
  audioUrl: string
  coverImage: string
  moodTags: string[]
  plays: number
  likes?: number
}

interface SongCardProps {
  song: Song
}

export default function SongCard({ song }: SongCardProps) {
  const { currentSong, isPlaying, playSong, pauseSong } = useMusic()
  const [isLiked, setIsLiked] = useState(false)
  const isCurrentSong = currentSong?._id === song._id

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`
    }
    return plays.toString()
  }

  const handlePlayPause = () => {
    if (isCurrentSong && isPlaying) {
      pauseSong()
    } else {
      playSong(song)
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <div className="group bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
      {/* Cover Image */}
      <div className="relative mb-4">
        <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg overflow-hidden">
          <img
            src={song.coverImage || "/placeholder.svg?height=300&width=300"}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Play Button Overlay */}
        <button
          onClick={handlePlayPause}
          className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200 shadow-lg"
        >
          {isCurrentSong && isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>

        {/* Currently Playing Indicator */}
        {isCurrentSong && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>Playing</span>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold truncate group-hover:text-green-400 transition-colors">{song.title}</h3>
        <p className="text-gray-400 text-sm truncate">{song.artist}</p>

        {/* Mood Tags */}
        {song.moodTags && song.moodTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {song.moodTags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatDuration(song.duration)}</span>
          <span>{formatPlays(song.plays)} plays</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleLike}
          className={`transition-colors ${isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>

        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
