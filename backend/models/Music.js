const mongoose = require("mongoose")

const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    album: {
      type: String,
      trim: true,
    },
    genre: [
      {
        type: String,
        required: true,
      },
    ],
    duration: {
      type: Number,
      required: true, // in seconds
    },
    audioUrl: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    lyrics: {
      type: String,
      default: "",
    },
    moodTags: [
      {
        type: String,
        enum: [
          "happy",
          "sad",
          "energetic",
          "calm",
          "romantic",
          "angry",
          "nostalgic",
          "motivational",
          "relaxing",
          "party",
        ],
      },
    ],
    audioFeatures: {
      tempo: {
        type: Number,
        min: 0,
        max: 300,
      },
      energy: {
        type: Number,
        min: 0,
        max: 1,
      },
      valence: {
        type: Number,
        min: 0,
        max: 1,
      },
      danceability: {
        type: Number,
        min: 0,
        max: 1,
      },
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
musicSchema.index({
  title: "text",
  artist: "text",
  album: "text",
})

module.exports = mongoose.model("Music", musicSchema)
