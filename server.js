const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static files from public directory
app.use(express.static('public'));

// Routes (Placeholders for now)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/learn', require('./routes/learn'));
app.use('/api/lab', require('./routes/lab'));
app.use('/api/user', require('./routes/user'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

