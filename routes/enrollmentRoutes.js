const express = require("express");
const { enrollInCourse, getMyEnrollments } = require("../controllers/enrollmentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, enrollInCourse);
router.get("/", protect, getMyEnrollments);

module.exports = router;
