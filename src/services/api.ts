import axios from "axios"
import { API_CONFIG } from "../config/constants"

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem("token")
      window.location.href = "/login"
      return Promise.reject(error)
    }

    // Handle network errors with retry logic
    if (!error.response && originalRequest._retryCount < API_CONFIG.RETRY_ATTEMPTS) {
      originalRequest._retryCount = originalRequest._retryCount || 0
      originalRequest._retryCount++

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * originalRequest._retryCount))

      return api(originalRequest)
    }

    return Promise.reject(error)
  },
)

// Auth API endpoints
export const authAPI = {
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),

  register: (data: { username: string; email: string; password: string }) => api.post("/auth/register", data),

  getProfile: () => api.get("/auth/profile"),

  updateProfile: (data: any) => api.put("/auth/profile", data),

  refreshToken: () => api.post("/auth/refresh"),
}

// Music API endpoints
export const musicAPI = {
  getAllSongs: (params?: any) => api.get("/music", { params }),

  getSong: (id: string) => api.get(`/music/${id}`),

  uploadSong: (formData: FormData) =>
    api.post("/music/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // 60 seconds for file upload
    }),

  likeSong: (id: string) => api.post(`/music/${id}/like`),

  searchSongs: (query: string, filters?: any) => api.get(`/music/search`, { params: { q: query, ...filters } }),

  getTrendingSongs: (limit = 20) => api.get(`/music`, { params: { sort: "plays", limit } }),

  getRecentSongs: (limit = 20) => api.get(`/music`, { params: { sort: "createdAt", limit } }),
}

// Mood API endpoints
export const moodAPI = {
  getMoodTemplates: () => api.get("/mood/templates"),

  getSongsByMood: (mood: string, params?: any) => api.get(`/mood/${mood}`, { params }),

  getPersonalizedRecommendations: () => api.get("/mood/recommendations"),

  updateMoodHistory: (data: { mood: string; songs: string[] }) => api.post("/mood/history", data),

  createMoodTemplate: (data: any) => api.post("/mood/templates", data),

  getMoodAnalytics: () => api.get("/mood/analytics"),
}

// Playlist API endpoints
export const playlistAPI = {
  getUserPlaylists: () => api.get("/playlist"),

  createPlaylist: (data: { name: string; description?: string; isPublic?: boolean }) => api.post("/playlist", data),

  getPlaylist: (id: string) => api.get(`/playlist/${id}`),

  updatePlaylist: (id: string, data: any) => api.put(`/playlist/${id}`, data),

  deletePlaylist: (id: string) => api.delete(`/playlist/${id}`),

  addToPlaylist: (id: string, songId: string) => api.post(`/playlist/${id}/songs`, { songId }),

  removeFromPlaylist: (id: string, songId: string) => api.delete(`/playlist/${id}/songs/${songId}`),

  getPublicPlaylists: (params?: any) => api.get("/playlist/public", { params }),
}

// User API endpoints
export const userAPI = {
  followUser: (id: string) => api.post(`/user/${id}/follow`),

  unfollowUser: (id: string) => api.delete(`/user/${id}/follow`),

  getUserProfile: (id: string) => api.get(`/user/${id}`),

  getRecentlyPlayed: () => api.get("/user/recently-played"),

  getListeningHistory: (params?: any) => api.get("/user/history", { params }),

  updateListeningActivity: (songId: string) => api.post("/user/activity", { songId }),

  getFollowing: () => api.get("/user/following"),

  getFollowers: () => api.get("/user/followers"),

  searchUsers: (query: string) => api.get(`/user/search`, { params: { q: query } }),
}

// Admin API endpoints (for future admin features)
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),

  getUsers: (params?: any) => api.get("/admin/users", { params }),

  getSongs: (params?: any) => api.get("/admin/songs", { params }),

  moderateContent: (id: string, action: string) => api.post(`/admin/moderate/${id}`, { action }),
}

export default api
