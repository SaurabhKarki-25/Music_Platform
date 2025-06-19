"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import toast from "react-hot-toast"

interface User {
  _id: string
  username: string
  email: string
  profile: {
    avatar: string
    bio: string
    favoriteGenres: string[]
    moodPreferences: string[]
  }
  subscription: {
    type: "free" | "premium"
    expiresAt?: Date
  }
  likedSongs: string[]
  following: string[]
  followers: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User["profile"]>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demo
const mockUser: User = {
  _id: "demo-user-123",
  username: "MusicLover",
  email: "demo@moodharmony.com",
  profile: {
    avatar: "",
    bio: "Music enthusiast who loves discovering new sounds and moods 🎵",
    favoriteGenres: ["Pop", "Electronic", "Jazz", "Rock"],
    moodPreferences: ["happy", "energetic", "calm", "focus"],
  },
  subscription: {
    type: "premium",
    expiresAt: new Date("2024-12-31"),
  },
  likedSongs: ["song1", "song2", "song3"],
  following: ["user1", "user2"],
  followers: ["user3", "user4", "user5"],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and auto-login for demo
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem("demo-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUser(mockUser)
      localStorage.setItem("demo-user", JSON.stringify(mockUser))
      toast.success("Welcome back to Mood Harmony!")
    } catch (error: any) {
      toast.error("Login failed")
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser = { ...mockUser, username, email }
      setUser(newUser)
      localStorage.setItem("demo-user", JSON.stringify(newUser))
      toast.success("Account created successfully!")
    } catch (error: any) {
      toast.error("Registration failed")
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("demo-user")
    setUser(null)
    toast.success("Logged out successfully")
  }

  const updateProfile = async (data: Partial<User["profile"]>) => {
    try {
      if (user) {
        const updatedUser = {
          ...user,
          profile: { ...user.profile, ...data },
        }
        setUser(updatedUser)
        localStorage.setItem("demo-user", JSON.stringify(updatedUser))
        toast.success("Profile updated successfully")
      }
    } catch (error: any) {
      toast.error("Update failed")
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
