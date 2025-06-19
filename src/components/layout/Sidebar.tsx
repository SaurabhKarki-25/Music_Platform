"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Home, Search, Library, Heart, Music, User, LogOut, Sparkles, Upload } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Your Library", href: "/library", icon: Library },
]

const moodNavigation = [{ name: "Mood Explorer", href: "/mood", icon: Sparkles }]

const libraryNavigation = [
  { name: "Upload Music", href: "/upload", icon: Upload },
  { name: "Liked Songs", href: "/liked", icon: Heart },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="w-64 bg-black/40 backdrop-blur-lg border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">Mood Harmony</span>
            <span className="text-xs text-gray-400 block">v1.0</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href) ? "bg-white/20 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Mood Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mood Features</h3>
          <div className="mt-2 space-y-1">
            {moodNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Library Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Library</h3>
          <div className="mt-2 space-y-1">
            {libraryNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href) ? "bg-white/20 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Playlists */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Playlists</h3>
          <div className="mt-2 space-y-1">
            {["My Favorites", "Chill Mix", "Workout Beats"].map((playlist) => (
              <button
                key={playlist}
                className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full text-left"
              >
                <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded mr-3 flex-shrink-0" />
                <span className="truncate">{playlist}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
            <p className="text-xs text-gray-400 truncate">
              {user?.subscription?.type === "premium" ? "Premium" : "Free"} Plan
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            to="/profile"
            className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors text-center"
          >
            Profile
          </Link>
          <button
            onClick={logout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
