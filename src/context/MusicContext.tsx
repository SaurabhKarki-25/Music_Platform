"use client"

import React, { createContext, useContext, useState, useRef, type ReactNode } from "react"
import toast from "react-hot-toast"

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
  likes: number
}

interface MusicContextType {
  currentSong: Song | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  queue: Song[]
  currentIndex: number
  playSong: (song: Song, queue?: Song[]) => void
  pauseSong: () => void
  resumeSong: () => void
  nextSong: () => void
  previousSong: () => void
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

// Mock songs data for demo
const mockSongs: Song[] = [
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

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [queue, setQueue] = useState<Song[]>(mockSongs)
  const [currentIndex, setCurrentIndex] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const playSong = (song: Song, newQueue?: Song[]) => {
    if (newQueue) {
      setQueue(newQueue)
      const index = newQueue.findIndex((s) => s._id === song._id)
      setCurrentIndex(index >= 0 ? index : 0)
    }

    setCurrentSong(song)
    setIsPlaying(true)
    setDuration(song.duration)
    setCurrentTime(0)

    // Simulate audio playback
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= song.duration) {
          nextSong()
          return 0
        }
        return prev + 1
      })
    }, 1000)

    toast.success(`Now playing: ${song.title}`)
  }

  const pauseSong = () => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resumeSong = () => {
    setIsPlaying(true)
    if (currentSong && intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (currentSong && prev >= currentSong.duration) {
          nextSong()
          return 0
        }
        return prev + 1
      })
    }, 1000)
  }

  const nextSong = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      playSong(queue[nextIndex])
    } else if (queue.length > 0) {
      // Loop back to first song
      setCurrentIndex(0)
      playSong(queue[0])
    }
  }

  const previousSong = () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      playSong(queue[prevIndex])
    }
  }

  const seekTo = (time: number) => {
    setCurrentTime(time)
  }

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume)
  }

  const addToQueue = (song: Song) => {
    setQueue((prev) => [...prev, song])
    toast.success("Added to queue")
  }

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index))
  }

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        currentIndex,
        playSong,
        pauseSong,
        resumeSong,
        nextSong,
        previousSong,
        seekTo,
        setVolume,
        addToQueue,
        removeFromQueue,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error("useMusic must be used within MusicProvider")
  }
  return context
}
