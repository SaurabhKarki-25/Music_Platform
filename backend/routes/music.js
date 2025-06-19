const express = require("express")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const Music = require("../models/Music")
const auth = require("../middleware/auth")

const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
})

// Get all songs
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, mood, sort = "createdAt" } = req.query

    const query = { isActive: true }

    if (genre) {
      query.genre = { $in: genre.split(",") }
    }

    if (mood) {
      query.moodTags = { $in: mood.split(",") }
    }

    const songs = await Music.find(query)
      .populate("uploadedBy", "username")
      .sort({ [sort]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Music.countDocuments(query)

    res.json({
      success: true,
      data: songs,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching songs",
      error: error.message,
    })
  }
})

// Upload song
router.post(
  "/upload",
  auth,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, artist, album, genre, lyrics, moodTags } = req.body

      if (!req.files.audio) {
        return res.status(400).json({
          success: false,
          message: "Audio file is required",
        })
      }

      // Upload audio to cloudinary
      const audioResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "video", folder: "mood-harmony/audio" }, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          })
          .end(req.files.audio[0].buffer)
      })

      // Upload cover image if provided
      let coverResult = null
      if (req.files.cover) {
        coverResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "mood-harmony/covers" }, (error, result) => {
              if (error) reject(error)
              else resolve(result)
            })
            .end(req.files.cover[0].buffer)
        })
      }

      // Create song record
      const song = new Music({
        title,
        artist,
        album,
        genre: JSON.parse(genre),
        lyrics,
        moodTags: JSON.parse(moodTags),
        duration: audioResult.duration,
        audioUrl: audioResult.secure_url,
        coverImage: coverResult?.secure_url || "",
        uploadedBy: req.user.id,
        audioFeatures: {
          tempo: Math.floor(Math.random() * 200) + 60, // Mock data
          energy: Math.random(),
          valence: Math.random(),
          danceability: Math.random(),
        },
      })

      await song.save()

      res.status(201).json({
        success: true,
        data: song,
        message: "Song uploaded successfully",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error uploading song",
        error: error.message,
      })
    }
  },
)

// Search songs
router.get("/search", async (req, res) => {
  try {
    const { q, limit = 20 } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    const songs = await Music.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { artist: { $regex: q, $options: "i" } },
            { album: { $regex: q, $options: "i" } },
          ],
        },
      ],
    })
      .populate("uploadedBy", "username")
      .limit(Number.parseInt(limit))

    res.json({
      success: true,
      data: songs,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching songs",
      error: error.message,
    })
  }
})

// Like/Unlike song
router.post("/:id/like", auth, async (req, res) => {
  try {
    const song = await Music.findById(req.params.id)
    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      })
    }

    const user = req.user
    const isLiked = user.likedSongs.includes(song._id)

    if (isLiked) {
      // Unlike
      user.likedSongs = user.likedSongs.filter((id) => !id.equals(song._id))
      song.likes = Math.max(0, song.likes - 1)
    } else {
      // Like
      user.likedSongs.push(song._id)
      song.likes += 1
    }

    await user.save()
    await song.save()

    res.json({
      success: true,
      data: { isLiked: !isLiked, likes: song.likes },
      message: isLiked ? "Song unliked" : "Song liked",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating like status",
      error: error.message,
    })
  }
})

module.exports = router
