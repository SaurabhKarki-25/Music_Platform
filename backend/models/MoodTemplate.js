const mongoose = require("mongoose")

const moodTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      required: true,
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
        "focus",
        "workout",
      ],
    },
    tags: [
      {
        type: String,
      },
    ],
    criteria: {
      genres: [
        {
          type: String,
        },
      ],
      tempo: {
        min: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 300,
        },
      },
      energy: {
        min: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 1,
        },
      },
      valence: {
        min: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 1,
        },
      },
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("MoodTemplate", moodTemplateSchema)
