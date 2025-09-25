const express = require("express");
const { createLesson, getLessonsByCourse } = require("../controllers/lessonController");
const { protect, isInstructor } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, isInstructor, createLesson);
router.get("/:courseId", protect, getLessonsByCourse);

module.exports = router;
