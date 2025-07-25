const { getBatchEmbeddings } = require('./embeddingService');
const { calculateCosineSimilarity, checkIsReplica, classifySimilarity } = require('../../utilis/similarity');

// Process questions and find similarities between them
exports.processQuestions = async (questions, threshold = 0.8) => {
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
        const similarityResult = calculateCosineSimilarity(embeddings[i], embeddings[j]);

        if (!similarityResult.success) {
          throw new Error(`Similarity calculation failed for questions ${i} and ${j}`);
        }

        const replicaResult = checkIsReplica(embeddings[i], embeddings[j], threshold);
        const categoryResult = classifySimilarity(embeddings[i], embeddings[j]);

        results.push({
          question1: questions[i],
          question2: questions[j],
          similarity_score: Number(similarityResult.similarity.toFixed(4)),
          is_replica: replicaResult.success ? replicaResult.isReplica : false,
          similarity_category: categoryResult.success ? categoryResult.category : 'unknown'
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