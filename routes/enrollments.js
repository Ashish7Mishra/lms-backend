const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const auth = require('../middleware/auth');

// Enroll in a course (Student only)
router.post('/enroll', auth, async (req, res) => {
  if (req.user.role !== 'Student') return res.status(403).json({ error: 'Access denied' });

  const { courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const exists = await Enrollment.findOne({ student: req.user.userId, course: courseId });
    if (exists) return res.status(400).json({ error: 'Already enrolled' });

    const enrollment = new Enrollment({ student: req.user.userId, course: courseId, lessonsCompleted: [] });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: 'Enrollment failed' });
  }
});

// Get enrolled courses for student
router.get('/my-courses', auth, async (req, res) => {
  if (req.user.role !== 'Student') return res.status(403).json({ error: 'Access denied' });

  try {
    const enrollments = await Enrollment.find({ student: req.user.userId }).populate('course');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// Mark lesson complete (Student only)
router.post('/complete-lesson', auth, async (req, res) => {
  if (req.user.role !== 'Student') return res.status(403).json({ error: 'Access denied' });

  const { courseId, lessonId } = req.body;
  try {
    const enrollment = await Enrollment.findOne({ student: req.user.userId, course: courseId });
    if (!enrollment) return res.status(404).json({ error: 'Not enrolled in this course' });

    if (!enrollment.lessonsCompleted.includes(lessonId)) {
      enrollment.lessonsCompleted.push(lessonId);
      await enrollment.save();
    }
    res.json({ success: true, lessonsCompleted: enrollment.lessonsCompleted });
  } catch (err) {
    res.status(400).json({ error: 'Failed to mark lesson complete' });
  }
});

// Get progress for a course (Student only)
router.get('/progress/:courseId', auth, async (req, res) => {
  if (req.user.role !== 'Student') return res.status(403).json({ error: 'Access denied' });

  const { courseId } = req.params;
  try {
    const enrollment = await Enrollment.findOne({ student: req.user.userId, course: courseId });
    if (!enrollment) return res.status(404).json({ error: 'Not enrolled in this course' });

    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const completed = enrollment.lessonsCompleted.length;
    const progress = totalLessons ? (completed / totalLessons) * 100 : 0;

    res.json({ totalLessons, completed, progress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;
