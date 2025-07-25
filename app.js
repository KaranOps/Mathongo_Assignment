const express = require('express');
const cors = require('cors');
const questionRoutes = require('./routes/questionRoutes.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/questions', questionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI-Powered Question Similarity & Replica Detector API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/questions/health',
      sampleQuestions: 'GET /api/questions/sample-questions',
      replicaCheck: 'POST /api/questions/replica-check'
    }
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}`);
});

module.exports = app;