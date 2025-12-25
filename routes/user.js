const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get user progress
// @route   GET /api/user/progress
router.get('/progress', protect, async (req, res) => {
    try {
        const Progress = require('../models/Progress');
        let progress = await Progress.findOne({ user: req.user.id });

        if (!progress) {
            progress = { completedContentIds: [], badges: [] };
        }

        const completedCount = progress.completedContentIds ? progress.completedContentIds.length : 0;

        // Mocking subject breakdown based on ID prefix for demo
        const mathCount = (progress.completedContentIds || []).filter(id => id.startsWith('m')).length;
        const scienceCount = (progress.completedContentIds || []).filter(id => id.startsWith('s')).length;

        // Total content count (hardcoded based on our mock DB for percentage calc)
        const mathTotal = 3;
        const scienceTotal = 1;

        const progressData = {
            subjects: [
                { name: 'Mathematics', completed: Math.round((mathCount / mathTotal) * 100), color: '#6C63FF' },
                { name: 'Science', completed: Math.round((scienceCount / scienceTotal) * 100), color: '#00D2FF' }
            ],
            recentActivity: [
                { action: 'Joined GamiLearn', date: '2023-12-23' }
            ],
            stats: {
                videosWatched: mathCount + scienceCount, // Simplified assumption
                labsCompleted: (progress.completedContentIds || []).filter(id => id.includes('l')).length,
                badgesEarned: progress.badges ? progress.badges.length : 0
            },
            badges: (progress.badges || []).map(b => ({ name: b, icon: 'fa-medal' }))
        };
        res.json(progressData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
router.put('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            // In a real app we'd hash this again, handled by middleware or model pre-save usually, 
            // but here we did hashing in controller. For simplicity, skipping password update logic to avoid complexity/security risks in demo code without pre-save hooks.
            // user.password = req.body.password; 
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: req.headers.authorization.split(' ')[1] // Return same token
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
