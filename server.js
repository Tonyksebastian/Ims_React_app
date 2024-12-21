const express = require('express');
const mongoose = require('mongoose');
const employeeRoutes = require('./routes/employeeRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const voteRoutes = require('./routes/voteRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const userRoutes = require('./routes/userRoutes'); // Add this line

const app = express();

// Middleware to handle CORS
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON body
app.use(express.json()); // This line is essential for handling JSON requests

// Database connection
mongoose.connect('mongodb://localhost:27017/ims-connect', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Route setup
app.use('/employees', employeeRoutes);
app.use('/ideas', ideaRoutes);
app.use('/votes', voteRoutes);
app.use('/collaborations', collaborationRoutes);
app.use('/rewards', rewardRoutes);
app.use('/users', userRoutes); // Add this line

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));