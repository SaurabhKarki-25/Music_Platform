const express = require("express")
const moodController = require("../controllers/moodController")
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/templates", moodController.getMoodTemplates)
router.get("/recommendations", auth, moodController.getPersonalizedMoodRecommendations)
router.get("/:mood", moodController.getSongsByMood)
router.post("/templates", auth, moodController.createMoodTemplate)
router.post("/history", auth, moodController.updateMoodHistory)

module.exports = router
