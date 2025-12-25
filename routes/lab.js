const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Mock Data for Demo
const subjects = [
    { id: 'maths', name: 'Maths Lab', icon: 'fa-shapes', color: '#6C63FF' },
    { id: 'science', name: 'Science Lab', icon: 'fa-flask', color: '#00D2FF' }
];

const contentDB = {
    'maths': {
        1: [
            { id: 'l1_1', title: 'Shape Sorter', type: 'lab', url: 'https://phet.colorado.edu/sims/html/build-a-fraction/latest/build-a-fraction_en.html', description: 'Learn fractions by building shapes.' },
            { id: 'l1_2', title: 'Arithmetic Game', type: 'lab', url: 'https://phet.colorado.edu/sims/html/arithmetic/latest/arithmetic_en.html', description: 'Test your math skills.' }
        ]
    },
    'science': {
        1: [
            { id: 'sl1_1', title: 'Color Vision', type: 'lab', url: 'https://phet.colorado.edu/sims/html/color-vision/latest/color-vision_en.html', description: 'Explore how colors mix.' }
        ]
    }
};

// @desc    Get all subjects
// @route   GET /api/lab/subjects
router.get('/subjects', protect, (req, res) => {
    res.json(subjects);
});

// @desc    Get content by subject and class
// @route   GET /api/lab/:subject/:classId
router.get('/:subject/:classId', protect, (req, res) => {
    const { subject, classId } = req.params;
    const data = contentDB[subject] ? contentDB[subject][classId] || [] : [];
    // In real app, we might also filter data based on user progress here
    res.json(data);
});

// @desc    Mark content as complete (Reuse logic or separate if needed)
// @route   POST /api/lab/complete
router.post('/complete', protect, async (req, res) => {
    // We can actually reuse the same logic as learn or just redirect to it if we had a common 'content' route. 
    // For now, putting it here for isolation.
    const { contentId } = req.body;
    const Progress = require('../models/Progress');
    const { checkBadges } = require('../utils/gamification');

    try {
        let progress = await Progress.findOne({ user: req.user.id });

        if (!progress) {
            progress = await Progress.create({
                user: req.user.id,
                completedContentIds: [], // Correct field name
                badges: []
            });
        }

        if (!progress.completedContentIds) progress.completedContentIds = [];

        if (!progress.completedContentIds.includes(contentId)) {
            progress.completedContentIds.push(contentId);

            // Gamification
            const newBadges = checkBadges({ ...progress.toObject(), completedContent: progress.completedContentIds });
            if (newBadges.length > 0) {
                progress.badges.push(...newBadges);
            }

            await progress.save();
        }

        res.json({ success: true, badges: progress.badges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
