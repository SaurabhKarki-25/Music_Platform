const MoodTemplate = require("../models/MoodTemplate")
const Music = require("../models/Music")
const User = require("../models/User")

// Get all mood templates
exports.getMoodTemplates = async (req, res) => {
  try {
    const templates = await MoodTemplate.find({ isActive: true })
      .populate("songs", "title artist coverImage duration")
      .sort({ usageCount: -1 })

    res.json({
      success: true,
      data: templates,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching mood templates",
      error: error.message,
    })
  }
}

// Get songs by mood
exports.getSongsByMood = async (req, res) => {
  try {
    const { mood } = req.params
    const { limit = 20, page = 1 } = req.query

    // Find mood template
    const template = await MoodTemplate.findOne({ mood, isActive: true })

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Mood template not found",
      })
    }

    // Build query based on template criteria
    const query = {
      isActive: true,
      moodTags: mood,
    }

    if (template.criteria.genres.length > 0) {
      query.genre = { $in: template.criteria.genres }
    }

    if (template.criteria.tempo.min || template.criteria.tempo.max) {
      query["audioFeatures.tempo"] = {
        $gte: template.criteria.tempo.min,
        $lte: template.criteria.tempo.max,
      }
    }

    if (template.criteria.energy.min || template.criteria.energy.max) {
      query["audioFeatures.energy"] = {
        $gte: template.criteria.energy.min,
        $lte: template.criteria.energy.max,
      }
    }

    if (template.criteria.valence.min || template.criteria.valence.max) {
      query["audioFeatures.valence"] = {
        $gte: template.criteria.valence.min,
        $lte: template.criteria.valence.max,
      }
    }

    const songs = await Music.find(query)
      .populate("uploadedBy", "username")
      .sort({ plays: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Update template usage count
    await MoodTemplate.findByIdAndUpdate(template._id, {
      $inc: { usageCount: 1 },
    })

    res.json({
      success: true,
      data: {
        template,
        songs,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total: await Music.countDocuments(query),
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching songs by mood",
      error: error.message,
    })
  }
}

// Create mood template (Admin only)
exports.createMoodTemplate = async (req, res) => {
  try {
    const { name, description, mood, tags, criteria } = req.body

    const template = new MoodTemplate({
      name,
      description,
      mood,
      tags,
      criteria,
      createdBy: req.user.id,
    })

    await template.save()

    res.status(201).json({
      success: true,
      data: template,
      message: "Mood template created successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating mood template",
      error: error.message,
    })
  }
}

// Get personalized mood recommendations
exports.getPersonalizedMoodRecommendations = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Analyze user's mood history and preferences
    const recentMoods = user.moodHistory.slice(-10)
    const favoriteGenres = user.profile.favoriteGenres

    // Get templates based on user preferences
    const query = { isActive: true }

    if (recentMoods.length > 0) {
      const moodCounts = {}
      recentMoods.forEach((entry) => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
      })

      const topMoods = Object.keys(moodCounts)
        .sort((a, b) => moodCounts[b] - moodCounts[a])
        .slice(0, 3)

      query.mood = { $in: topMoods }
    }

    const recommendations = await MoodTemplate.find(query)
      .populate("songs", "title artist coverImage duration")
      .limit(6)

    res.json({
      success: true,
      data: recommendations,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting personalized recommendations",
      error: error.message,
    })
  }
}

// Update user mood history
exports.updateMoodHistory = async (req, res) => {
  try {
    const { mood, songs } = req.body
    const userId = req.user.id

    await User.findByIdAndUpdate(userId, {
      $push: {
        moodHistory: {
          mood,
          songs,
          timestamp: new Date(),
        },
      },
    })

    res.json({
      success: true,
      message: "Mood history updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating mood history",
      error: error.message,
    })
  }
}
