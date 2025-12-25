const mongoose = require('mongoose');

const progressSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completedContentIds: [{
        type: String // Changed to String to support mock content IDs (m1_1 etc)
    }],
    badges: [{
        type: String // Store badge names/IDs
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
