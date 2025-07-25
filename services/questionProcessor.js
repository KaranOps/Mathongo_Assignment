const { getBatchEmbeddings } = require('./embeddingService');
const { calculateCosineSimilarity, manhattanDistance} = require('../utilis/similarity');

// Process questions and find similarities between them
exports.processQuestions = async (questions, threshold = 0.8 , alpha = 0.95) => {
  try {
    if (!Array.isArray(questions) || questions.length < 2) {
      throw new Error('At least 2 questions required');
    }

    // Generate embeddings for all questions
    const embeddingResult = await getBatchEmbeddings(questions);

    if (!embeddingResult.success) {
      throw new Error(embeddingResult.details || embeddingResult.error);
    }

    const embeddings = embeddingResult.embeddings;
    const results = [];

    // Compare each unique pair
    for (let i = 0; i < questions.length; i++) {
      for (let j = i + 1; j < questions.length; j++) {

        const similarityResult_Cosine = calculateCosineSimilarity(embeddings[i], embeddings[j]);
        const similarityResult_Manhatten = manhattanDistance(embeddings[i], embeddings[j]);
        
        const result = similarityResult_Cosine.similarity*alpha + similarityResult_Manhatten.distance*(1-alpha);

        const replicaResult = Number(result.toFixed(4)) >= threshold;

        results.push({
          question1: questions[i],
          question2: questions[j],
          similarity_score: Number(result.toFixed(4)),
          is_replica: replicaResult
        });
      }
    }

    return {
      success: true,
      results: results
    };

  } catch (err) {
    return {
      success: false,
      error: 'Question processing failed',
      details: err.message
    };
  }
};