const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Mock Data for Demo
const subjects = [
    { id: 'maths', name: 'Mathematics', icon: 'fa-calculator', color: '#6C63FF' },
    { id: 'science', name: 'Science', icon: 'fa-atom', color: '#00D2FF' }
];

const contentDB = {
    'maths': {
        1: [
            { id: 'm1_1', title: 'Counting 1 to 10', url: 'https://www.youtube.com/embed/Yt8GFgxlITs', duration: '5:00' },
            { id: 'm1_2', title: 'Basic Shapes', url: 'https://www.youtube.com/embed/Tjhfl5vdxp4', duration: '4:20' }
        ],
        8: [
            { id: 'm8_1', title: 'Algebra Basics', url: 'https://www.youtube.com/embed/NybHckSEQBI', duration: '10:00' }
        ]
    },
    'science': {
        1: [
            { id: 's1_1', title: 'Living vs Non-Living', url: 'https://www.youtube.com/embed/p51FiPO2_kQ', duration: '6:15' }
        ]
    }
};

// @desc    Get all subjects
// @route   GET /api/learn/subjects
router.get('/subjects', protect, (req, res) => {
    res.json(subjects);
});

// @desc    Get content by subject and class
// @route   GET /api/learn/:subject/:classId
const Progress = require('../models/Progress');
const { checkBadges } = require('../utils/gamification');

// @desc    Get content by subject and class
// @route   GET /api/learn/:subject/:classId
router.get('/:subject/:classId', protect, (req, res) => {
    const { subject, classId } = req.params;
    const data = contentDB[subject] ? contentDB[subject][classId] || [] : [];

    // In real app, we might also filter data based on user progress here
    res.json(data);
});

// @desc    Mark content as complete
// @route   POST /api/learn/complete
router.post('/complete', protect, async (req, res) => {
    const { contentId, subject, type } = req.body;

    try {
        let progress = await Progress.findOne({ user: req.user.id });

        if (!progress) {
            progress = await Progress.create({
                user: req.user.id,
                completedContent: [],
                badges: []
            });
        }

        // Check if already completed (by checking if ID is in list - assuming we store IDs, 
        // actually for this demo contentDB has IDs like 'm1_1', which are strings not ObjectIds.
        // We need to modify schema to accept strings or Create Content documents first.
        // For this hybrid demo, we will store string IDs in a separate field or just mock the ObjectId behavior by storing strings in Array<String> instead of ObjectId refs if possible, 
        // BUT schema said [ObjectId]. Let's update Schema to Mixed or String for simplicity of this demo where 'Content' collection is not fully populated with these mock items.
        // DECISION: Update Progress Schema to allow String IDs for this specific demo content.

        // Wait, best practice is to actually have Content in DB. But populating DB is tedious.
        // I will modify Progress Schema to simple Array of Strings for 'completedContentIds' to work with the Mock Content DB.

        // Let's assume we modify schema in next step. For now, logic:
        if (!progress.completedContentIds) progress.completedContentIds = [];

        if (!progress.completedContentIds.includes(contentId)) {
            progress.completedContentIds.push(contentId);

            // Gamification
            const newBadges = checkBadges({ ...progress.toObject(), completedContent: progress.completedContentIds }); // Logic adapter
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
