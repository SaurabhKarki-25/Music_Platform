"use client"

import { useState, useMemo } from "react"
import { useQuery } from "react-query"
import { musicAPI, userAPI } from "../services/api"
import { useMusic } from "../context/MusicContext"
import SongCard from "../components/music/SongCard"
import LoadingSpinner from "../components/common/LoadingSpinner"
import { SearchIcon, Filter, Music, User, Disc } from "lucide-react"

const genres = [
  "Pop",
  "Rock",
  "Hip Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "Country",
  "R&B",
  "Reggae",
  "Folk",
  "Blues",
  "Punk",
]

const moods = [
  "happy",
  "sad",
  "energetic",
  "calm",
  "romantic",
  "party",
  "focus",
  "relaxing",
  "motivational",
  "nostalgic",
]

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"songs" | "artists" | "playlists">("songs")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    genres: [] as string[],
    moods: [] as string[],
    sortBy: "relevance",
  })

  const { playSong } = useMusic()

  // Search songs
  const {
    data: searchResults,
    isLoading: searchLoading,
    refetch: searchSongs,
  } = useQuery(["searchSongs", searchQuery, filters], () => musicAPI.searchSongs(searchQuery, filters), {
    enabled: searchQuery.length > 0,
    staleTime: 30000, // 30 seconds
  })

  // Search users
  const { data: userResults, isLoading: userLoading } = useQuery(
    ["searchUsers", searchQuery],
    () => userAPI.searchUsers(searchQuery),
    {
      enabled: searchQuery.length > 0 && activeTab === "artists",
      staleTime: 30000,
    },
  )

  // Trending songs for empty state
  const { data: trendingSongs, isLoading: trendingLoading } = useQuery(
    "trendingSongs",
    () => musicAPI.getTrendingSongs(12),
    {
      enabled: searchQuery.length === 0,
    },
  )

  // Recent songs
  const { data: recentSongs, isLoading: recentLoading } = useQuery("recentSongs", () => musicAPI.getRecentSongs(8), {
    enabled: searchQuery.length === 0,
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const toggleFilter = (type: "genres" | "moods", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value) ? prev[type].filter((item) => item !== value) : [...prev[type], value],
    }))
  }

  const clearFilters = () => {
    setFilters({
      genres: [],
      moods: [],
      sortBy: "relevance",
    })
  }

  const hasActiveFilters = filters.genres.length > 0 || filters.moods.length > 0

  const displayResults = useMemo(() => {
    if (!searchQuery) return []

    switch (activeTab) {
      case "songs":
        return searchResults?.data?.data || []
      case "artists":
        return userResults?.data?.data || []
      default:
        return []
    }
  }, [searchQuery, activeTab, searchResults, userResults])

  return (
    <div className="p-6 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Search</h1>

        {/* Search Input */}
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for songs, artists, or albums..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Search Tabs */}
        {searchQuery && (
          <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-lg rounded-lg p-1 w-fit">
            {[
              { key: "songs", label: "Songs", icon: Music },
              { key: "artists", label: "Artists", icon: User },
              { key: "playlists", label: "Playlists", icon: Disc },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === key ? "bg-purple-500 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        {searchQuery && activeTab === "songs" && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                showFilters || hasActiveFilters
                  ? "bg-purple-500/20 border-purple-500 text-purple-300"
                  : "bg-white/10 border-white/20 text-gray-300 hover:border-white/40"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {filters.genres.length + filters.moods.length}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-gray-400 hover:text-white text-sm">
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && searchQuery && activeTab === "songs" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
            {/* Genres */}
            <div>
              <h3 className="text-white font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleFilter("genres", genre)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      filters.genres.includes(genre)
                        ? "bg-purple-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Moods */}
            <div>
              <h3 className="text-white font-semibold mb-3">Moods</h3>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => toggleFilter("moods", mood)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition-all ${
                      filters.moods.includes(mood)
                        ? "bg-pink-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-white font-semibold mb-3">Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="relevance">Relevance</option>
                <option value="plays">Most Played</option>
                <option value="createdAt">Newest</option>
                <option value="title">Title A-Z</option>
                <option value="artist">Artist A-Z</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchQuery ? (
        <div className="space-y-6">
          {searchLoading || userLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {displayResults.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">
                    {activeTab === "songs" ? "Songs" : activeTab === "artists" ? "Artists" : "Playlists"}
                    <span className="text-gray-400 ml-2">({displayResults.length} results)</span>
                  </h2>

                  {activeTab === "songs" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {displayResults.map((song: any) => (
                        <SongCard key={song._id} song={song} />
                      ))}
                    </div>
                  ) : activeTab === "artists" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {displayResults.map((user: any) => (
                        <div
                          key={user._id}
                          className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                        >
                          <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                              <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{user.username}</h3>
                              <p className="text-gray-400 text-sm">{user.followers?.length || 0} followers</p>
                            </div>
                            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors">
                              Follow
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-center py-12">
                  <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                  <p className="text-gray-400">Try adjusting your search terms or filters</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* Empty State - Show Trending and Recent */
        <div className="space-y-8">
          {/* Trending Songs */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
            {trendingLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingSongs?.data?.data?.map((song: any) => (
                  <SongCard key={song._id} song={song} />
                ))}
              </div>
            )}
          </section>

          {/* Recent Songs */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Recently Added</h2>
            {recentLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentSongs?.data?.data?.map((song: any) => (
                  <SongCard key={song._id} song={song} />
                ))}
              </div>
            )}
          </section>

          {/* Browse by Genre */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Browse by Genre</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleSearch(genre)}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all group"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-semibold">{genre}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
