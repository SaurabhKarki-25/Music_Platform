"use client"

import { useState } from "react"
import { useQuery } from "react-query"
import { playlistAPI, userAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { useMusic } from "../context/MusicContext"
import SongCard from "../components/music/SongCard"
import LoadingSpinner from "../components/common/LoadingSpinner"
import { Music, Heart, Clock, Plus, Play, MoreHorizontal, Grid3X3, List } from "lucide-react"

export default function Library() {
  const [activeTab, setActiveTab] = useState<"playlists" | "liked" | "recent">("playlists")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { user } = useAuth()
  const { playSong } = useMusic()

  // Fetch user playlists
  const { data: playlists, isLoading: playlistsLoading } = useQuery("userPlaylists", playlistAPI.getUserPlaylists)

  // Fetch liked songs
  const { data: likedSongs, isLoading: likedLoading } = useQuery(
    "likedSongs",
    () => userAPI.getRecentlyPlayed(), // This would be replaced with actual liked songs endpoint
    {
      enabled: activeTab === "liked",
    },
  )

  // Fetch recently played
  const { data: recentlyPlayed, isLoading: recentLoading } = useQuery("recentlyPlayed", userAPI.getRecentlyPlayed, {
    enabled: activeTab === "recent",
  })

  const tabs = [
    { key: "playlists", label: "Playlists", icon: Music, count: playlists?.data?.data?.length || 0 },
    { key: "liked", label: "Liked Songs", icon: Heart, count: user?.likedSongs?.length || 0 },
    { key: "recent", label: "Recently Played", icon: Clock, count: recentlyPlayed?.data?.data?.length || 0 },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "playlists":
        if (playlistsLoading) return <LoadingSpinner />

        return (
          <div className="space-y-6">
            {/* Create Playlist Button */}
            <button className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Create Playlist</h3>
                  <p className="text-gray-400 text-sm">Start building your perfect collection</p>
                </div>
              </div>
            </button>

            {/* Playlists Grid */}
            {playlists?.data?.data?.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}
              >
                {playlists.data.data.map((playlist: any) => (
                  <div
                    key={playlist._id}
                    className={`bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all group cursor-pointer ${
                      viewMode === "grid" ? "p-4" : "p-3 flex items-center space-x-4"
                    }`}
                  >
                    {viewMode === "grid" ? (
                      <>
                        <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                          {playlist.coverImage ? (
                            <img
                              src={playlist.coverImage || "/placeholder.svg"}
                              alt={playlist.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Music className="w-8 h-8 text-white" />
                          )}
                          <button className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-white font-semibold truncate">{playlist.name}</h3>
                          <p className="text-gray-400 text-sm">{playlist.songs?.length || 0} songs</p>
                          <p className="text-gray-500 text-xs line-clamp-2">{playlist.description}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Music className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">{playlist.name}</h3>
                          <p className="text-gray-400 text-sm">{playlist.songs?.length || 0} songs</p>
                        </div>
                        <button className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No playlists yet</h3>
                <p className="text-gray-400 mb-4">Create your first playlist to get started</p>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors">
                  Create Playlist
                </button>
              </div>
            )}
          </div>
        )

      case "liked":
        if (likedLoading) return <LoadingSpinner />

        return (
          <div className="space-y-6">
            {/* Liked Songs Header */}
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Liked Songs</h2>
                  <p className="text-gray-300">{user?.likedSongs?.length || 0} songs</p>
                </div>
                <div className="flex-1" />
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-colors">
                  <Play className="w-5 h-5" />
                  <span>Play All</span>
                </button>
              </div>
            </div>

            {/* Liked Songs List */}
            {user?.likedSongs?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* This would be populated with actual liked songs */}
                <div className="text-center py-8 col-span-full">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Your liked songs will appear here</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No liked songs yet</h3>
                <p className="text-gray-400">Songs you like will appear here</p>
              </div>
            )}
          </div>
        )

      case "recent":
        if (recentLoading) return <LoadingSpinner />

        return (
          <div className="space-y-6">
            {/* Recently Played Header */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Recently Played</h2>
                  <p className="text-gray-300">Your listening history</p>
                </div>
              </div>
            </div>

            {/* Recently Played List */}
            {recentlyPlayed?.data?.data?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentlyPlayed.data.data.slice(0, 12).map((item: any) => (
                  <SongCard key={`${item.song._id}-${item.playedAt}`} song={item.song} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No recent activity</h3>
                <p className="text-gray-400">Start listening to see your history here</p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "grid" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "list" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-lg p-1 w-fit">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeTab === key ? "bg-purple-500 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {count > 0 && <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{count}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}
