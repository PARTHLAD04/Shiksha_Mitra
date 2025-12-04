const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }, // URL to video (e.g., YouTube embed)
    quiz: [{
        question: String,
        options: [String],
        correctAnswer: Number // Index of correct option
    }]
});

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    chapters: [chapterSchema]
});

const classSchema = new mongoose.Schema({
    level: { type: String, required: true, unique: true }, // e.g., "Class 6"
    subjects: [subjectSchema]
});

module.exports = mongoose.model('ClassContent', classSchema);
