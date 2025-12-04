const express = require('express');
const router = express.Router();
const ClassContent = require('../models/Content');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all classes
// @route   GET /api/content/classes
// @access  Private
router.get('/classes', protect, async (req, res) => {
    try {
        const classes = await ClassContent.find({}, 'level');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get subjects for a class
// @route   GET /api/content/:classId/subjects
// @access  Private
router.get('/:classId/subjects', protect, async (req, res) => {
    try {
        const classContent = await ClassContent.findById(req.params.classId);
        if (!classContent) {
            return res.status(404).json({ message: 'Class not found' });
        }
        // Return subjects with id and name only
        const subjects = classContent.subjects.map(sub => ({
            _id: sub._id,
            name: sub.name
        }));
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get chapters for a subject
// @route   GET /api/content/:classId/subjects/:subjectId/chapters
// @access  Private
router.get('/:classId/subjects/:subjectId/chapters', protect, async (req, res) => {
    try {
        const classContent = await ClassContent.findById(req.params.classId);
        if (!classContent) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const subject = classContent.subjects.id(req.params.subjectId);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.json(subject.chapters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single chapter details
// @route   GET /api/content/:classId/subjects/:subjectId/chapters/:chapterId
// @access  Private
router.get('/:classId/subjects/:subjectId/chapters/:chapterId', protect, async (req, res) => {
    try {
        const classContent = await ClassContent.findById(req.params.classId);
        const subject = classContent.subjects.id(req.params.subjectId);
        const chapter = subject.chapters.id(req.params.chapterId);

        res.json(chapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
