const express = require('express');
const router = express.Router();
const controller = require('../controllers/questionController');

// POST /replica-check
router.post('/replica-check', controller.replicaCheck);

// GET /sample-questions
router.get('/sample-questions', controller.sampleQuestions);

// GET /health
router.get('/health', controller.health);

module.exports = router;
