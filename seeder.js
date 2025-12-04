const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ClassContent = require('./models/Content');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await ClassContent.deleteMany();

        const classes = [];

        for (let i = 6; i <= 12; i++) {
            classes.push({
                level: `Class ${i}`,
                subjects: [
                    {
                        name: 'Mathematics',
                        chapters: [
                            {
                                title: 'Chapter 1: Algebra Basics',
                                videoUrl: 'https://www.youtube.com/embed/NybHckSEQBI', // Placeholder
                                quiz: [
                                    {
                                        question: 'What is 2 + 2?',
                                        options: ['3', '4', '5', '6'],
                                        correctAnswer: 1
                                    },
                                    {
                                        question: 'What is 5 * 5?',
                                        options: ['20', '25', '30', '35'],
                                        correctAnswer: 1
                                    }
                                ]
                            },
                            {
                                title: 'Chapter 2: Geometry',
                                videoUrl: 'https://www.youtube.com/embed/302eJ3TzJjg', // Placeholder
                                quiz: [
                                    {
                                        question: 'How many sides does a triangle have?',
                                        options: ['2', '3', '4', '5'],
                                        correctAnswer: 1
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Science',
                        chapters: [
                            {
                                title: 'Chapter 1: Physics Intro',
                                videoUrl: 'https://www.youtube.com/embed/b1t41Q3xRM8', // Placeholder
                                quiz: [
                                    {
                                        question: 'What is the unit of Force?',
                                        options: ['Newton', 'Joule', 'Watt', 'Pascal'],
                                        correctAnswer: 0
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        }

        await ClassContent.insertMany(classes);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
