import { Music } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <Music className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500"></div>
        </div>
        <p className="text-white mt-4 text-lg font-semibold">Loading Mood Harmony...</p>
        <p className="text-gray-400 text-sm">Preparing your perfect soundtrack</p>
      </div>
    </div>
  )
}
