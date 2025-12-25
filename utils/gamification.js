const Models = require('../models/Progress');
const Progress = Models; // Changed to match file export if single model
// Actually models/Progress.js exports single model directly

// Helper to check badges (Example logic)
const checkBadges = (progress) => {
    const badges = [];
    const count = progress.completedContent.length;

    if (count >= 1 && !progress.badges.includes('First Step')) {
        badges.push('First Step');
    }
    if (count >= 5 && !progress.badges.includes('High Five')) {
        badges.push('High Five');
    }
    if (count >= 10 && !progress.badges.includes('Decathlete')) {
        badges.push('Decathlete');
    }

    return badges;
};

module.exports = { checkBadges };
