const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");

// Enroll in a course
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all enrolled courses for a student
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate("course","'title description category imageUrl'");
    res.status(200).json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { enrollInCourse, getMyEnrollments };
