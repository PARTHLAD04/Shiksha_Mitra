const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

// @desc    Update progress (Watch video or Pass quiz)
// @route   POST /api/users/progress
// @access  Private
router.post('/progress', protect, async (req, res) => {
    const { classLevel, subjectName, chapterTitle, type } = req.body;
    // type can be 'watch' or 'quiz'

    try {
        let progress = await Progress.findOne({
            user: req.user.id,
            classLevel,
            subjectName,
            chapterTitle
        });

        if (!progress) {
            progress = new Progress({
                user: req.user.id,
                classLevel,
                subjectName,
                chapterTitle
            });
        }

        let pointsToAdd = 0;

        if (type === 'watch') {
            progress.isWatched = true;
        } else if (type === 'quiz') {
            if (!progress.quizPassed) {
                progress.quizPassed = true;
                progress.pointsEarned = 10;
                pointsToAdd = 10;
            }
        }

        await progress.save();

        // Update user stats
        if (pointsToAdd > 0) {
            const user = await User.findById(req.user.id);
            user.totalPoints += pointsToAdd;
            user.modulesCompleted += 1; // Assuming 1 chapter = 1 module
            await user.save();
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
    try {
        const users = await User.find({})
            .sort({ totalPoints: -1 })
            .limit(10)
            .select('name totalPoints modulesCompleted');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user progress list
// @route   GET /api/users/my-progress
// @access  Private
router.get('/my-progress', protect, async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user.id });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
