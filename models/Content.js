const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'lab'],
        required: true
    },
    subject: {
        type: String,
        enum: ['Maths', 'Science'], // Add more subjects as needed
        required: true
    },
    classLevel: {
        type: Number,
        required: true
    },
    contentUrl: {
        type: String,
        required: true // URL to video or simulation page/asset
    },
    description: {
        type: String
    },
    thumbnail: {
        type: String
    }
});

module.exports = mongoose.model('Content', contentSchema);
