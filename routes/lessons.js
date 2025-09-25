const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Create lesson (Instructor only, verify course ownership)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Instructor') return res.status(403).json({ error: 'Access denied' });

  const { title, content, order, course } = req.body;
  try {
    const foundCourse = await Course.findById(course);
    if (!foundCourse) return res.status(404).json({ error: 'Course not found' });
    if (foundCourse.owner.toString() !== req.user.userId) return res.status(403).json({ error: 'Not course owner' });

    const lesson = new Lesson({ title, content, order, course });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create lesson' });
  }
});

// Update lesson (Instructor only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'Instructor') return res.status(403).json({ error: 'Access denied' });

  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    if (lesson.course.owner.toString() !== req.user.userId) return res.status(403).json({ error: 'Not course owner' });

    Object.assign(lesson, req.body);
    await lesson.save();
    res.json(lesson);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update lesson' });
  }
});

// Delete lesson (Instructor only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'Instructor') return res.status(403).json({ error: 'Access denied' });

  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    if (lesson.course.owner.toString() !== req.user.userId) return res.status(403).json({ error: 'Not course owner' });

    await lesson.remove();
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete lesson' });
  }
});

// Get lessons for a course (public)
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort('order');
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

module.exports = router;
