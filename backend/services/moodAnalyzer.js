const Music = require("../models/Music")
const MoodTemplate = require("../models/MoodTemplate")

class MoodAnalyzer {
  constructor() {
    this.moodMappings = {
      happy: {
        valence: { min: 0.6, max: 1.0 },
        energy: { min: 0.5, max: 1.0 },
        tempo: { min: 100, max: 180 },
      },
      sad: {
        valence: { min: 0.0, max: 0.4 },
        energy: { min: 0.0, max: 0.5 },
        tempo: { min: 60, max: 100 },
      },
      energetic: {
        energy: { min: 0.7, max: 1.0 },
        tempo: { min: 120, max: 200 },
        danceability: { min: 0.6, max: 1.0 },
      },
      calm: {
        energy: { min: 0.0, max: 0.4 },
        valence: { min: 0.3, max: 0.7 },
        tempo: { min: 60, max: 100 },
      },
      romantic: {
        valence: { min: 0.4, max: 0.8 },
        energy: { min: 0.2, max: 0.6 },
        tempo: { min: 70, max: 120 },
      },
      party: {
        energy: { min: 0.8, max: 1.0 },
        danceability: { min: 0.7, max: 1.0 },
        tempo: { min: 120, max: 200 },
      },
      focus: {
        energy: { min: 0.3, max: 0.7 },
        valence: { min: 0.4, max: 0.8 },
        tempo: { min: 80, max: 140 },
      },
      workout: {
        energy: { min: 0.8, max: 1.0 },
        tempo: { min: 140, max: 200 },
        danceability: { min: 0.6, max: 1.0 },
      },
    }
  }

  // Analyze song and determine mood tags
  async analyzeSongMood(audioFeatures) {
    const moods = []

    for (const [mood, criteria] of Object.entries(this.moodMappings)) {
      let matches = 0
      let totalCriteria = 0

      for (const [feature, range] of Object.entries(criteria)) {
        totalCriteria++
        const value = audioFeatures[feature]

        if (value >= range.min && value <= range.max) {
          matches++
        }
      }

      // If song matches 70% or more of the criteria, add the mood
      if (matches / totalCriteria >= 0.7) {
        moods.push(mood)
      }
    }

    return moods
  }

  // Get songs matching specific mood criteria
  async getSongsForMood(mood, options = {}) {
    const criteria = this.moodMappings[mood]
    if (!criteria) {
      throw new Error(`Unknown mood: ${mood}`)
    }

    const query = { isActive: true }

    // Build MongoDB query based on mood criteria
    for (const [feature, range] of Object.entries(criteria)) {
      query[`audioFeatures.${feature}`] = {
        $gte: range.min,
        $lte: range.max,
      }
    }

    // Add additional filters
    if (options.genres && options.genres.length > 0) {
      query.genre = { $in: options.genres }
    }

    if (options.excludeIds && options.excludeIds.length > 0) {
      query._id = { $nin: options.excludeIds }
    }

    const songs = await Music.find(query)
      .populate("uploadedBy", "username")
      .sort({ plays: -1 })
      .limit(options.limit || 20)

    return songs
  }

  // Create dynamic playlist based on mood progression
  async createMoodJourney(startMood, endMood, duration = 60) {
    const playlist = []
    const songsPerMood = Math.ceil(duration / 4) // Assuming 4-minute average song length

    // Get transition moods
    const transitionMoods = this.getMoodTransition(startMood, endMood)

    for (const mood of transitionMoods) {
      const songs = await this.getSongsForMood(mood, { limit: songsPerMood })
      playlist.push(...songs)
    }

    return playlist
  }

  // Define mood transitions for smooth playlist flow
  getMoodTransition(startMood, endMood) {
    const transitions = {
      "sad-happy": ["sad", "calm", "romantic", "happy"],
      "energetic-calm": ["energetic", "party", "romantic", "calm"],
      "calm-energetic": ["calm", "focus", "happy", "energetic"],
      "happy-sad": ["happy", "romantic", "calm", "sad"],
    }

    const key = `${startMood}-${endMood}`
    return transitions[key] || [startMood, endMood]
  }

  // Analyze user listening patterns to predict mood
  async predictUserMood(userId, recentSongs) {
    if (!recentSongs || recentSongs.length === 0) {
      return "neutral"
    }

    const moodScores = {}

    for (const song of recentSongs) {
      const songData = await Music.findById(song.song)
      if (songData && songData.audioFeatures) {
        const moods = await this.analyzeSongMood(songData.audioFeatures)

        moods.forEach((mood) => {
          moodScores[mood] = (moodScores[mood] || 0) + 1
        })
      }
    }

    // Return the most frequent mood
    return Object.keys(moodScores).reduce((a, b) => (moodScores[a] > moodScores[b] ? a : b)) || "neutral"
  }
}

module.exports = new MoodAnalyzer()
