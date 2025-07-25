const { processQuestions } = require('../services/nestedImpl/questionProcessor');
const fs = require('fs');

const sampleQuestions = JSON.parse(fs.readFileSync('./data/sampleQuestions.json', 'utf-8'));

// Handle replica check requests
exports.replicaCheck = async (req, res) => {
    try {
        const { questions, threshold = 0.8 } = req.body;

        // Input validation
        if (!Array.isArray(questions) || questions.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'At least 2 questions are required'
            });
        }

        // Process questions
        const result = await processQuestions(questions, threshold);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: result.error,
                details: result.details
            });
        }

        // Filter replicas for easy access
        const replicas = result.results.filter(r => r.is_replica);

        res.json({
            success: true,
            total_pairs: result.results.length,
            replica_count: replicas.length,
            threshold_used: threshold,
            replicas: replicas,
            all_results: result.results
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Replica check failed',
            details: err.message
        });
    }
};

// Serve sample questions dataset
exports.sampleQuestions = (req, res) => {
    try {
        res.json({
            success: true,
            questions: sampleQuestions,
            total_questions: sampleQuestions.length
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to load sample questions',
            details: err.message
        });
    }
};

// Health check endpoint
exports.health = (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
};