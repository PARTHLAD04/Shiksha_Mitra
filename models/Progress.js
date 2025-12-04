const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    classLevel: { type: String, required: true },
    subjectName: { type: String, required: true },
    chapterTitle: { type: String, required: true },
    isWatched: {
        type: Boolean,
        default: false
    },
    quizPassed: {
        type: Boolean,
        default: false
    },
    pointsEarned: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index to ensure unique progress record per chapter per user
progressSchema.index({ user: 1, classLevel: 1, subjectName: 1, chapterTitle: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
