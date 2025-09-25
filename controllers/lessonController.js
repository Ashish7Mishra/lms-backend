const Lesson = require("../models/lessonModel");
const Course = require("../models/courseModel");

// Create lesson
const createLesson = async (req, res) => {
  try {
    const { courseId, title, content, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only course instructor can add lessons
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to add lessons to this course" });
    }

    const lesson = await Lesson.create({ course: courseId, title, content, order });
    res.status(201).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get lessons for a course
const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort("order");
    res.status(200).json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createLesson, getLessonsByCourse };
