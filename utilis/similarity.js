// Calculate cosine similarity between two vectors
exports.calculateCosineSimilarity = (vecA, vecB) => {
    try {
        if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
            throw new Error('Input vectors must be arrays');
        }
        
        if (vecA.length !== vecB.length) {
            throw new Error('Input vectors must be of the same length');
        }

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        if (normA === 0 || normB === 0) {
            return {
                success: true,
                similarity: 0,
                percentage: 0,
                message: 'Zero vector detected'
            };
        }

        const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

        return {
            success: true,
            similarity: similarity,
            percentage: Math.round(similarity * 100 * 100) / 100
        };
    } catch (err) {
        return {
            success: false,
            error: 'Cosine similarity calculation failed',
            details: err.message
        };
    }
};

exports.manhattanDistance = (vecA, vecB) => {
    try {
        if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
            throw new Error('Input vectors must be arrays');
        }
        if (vecA.length !== vecB.length) {
            throw new Error('Input vectors must be of the same length');
        }
        let sum = 0;
        for (let i = 0; i < vecA.length; i++) {
            sum += Math.abs(vecA[i] - vecB[i]);
        }

        const x = sum; 
        const sim = (2 / (1 + Math.exp(-x))) - 1;
        return {
            success: true,
            distance: sim
        };
    } catch (err) {
        return {
            success: false,
            error: 'Manhattan distance calculation failed',
            details: err.message
        };
    }
};

// Compare multiple questions and find the most similar ones
exports.findMostSimilar = (targetVector, candidateVectors) => {
    try {
        if (!Array.isArray(candidateVectors) || candidateVectors.length === 0) {
            throw new Error('Candidate vectors must be a non-empty array');
        }

        const similarities = [];
        let maxSimilarity = -1;
        let mostSimilarIndex = -1;

        candidateVectors.forEach((vector, index) => {
            const result = exports.calculateCosineSimilarity(targetVector, vector);
            
            if (result.success) {
                similarities.push({
                    index: index,
                    similarity: result.similarity,
                    percentage: result.percentage
                });

                if (result.similarity > maxSimilarity) {
                    maxSimilarity = result.similarity;
                    mostSimilarIndex = index;
                }
            }
        });

        return {
            success: true,
            mostSimilarIndex: mostSimilarIndex,
            maxSimilarity: maxSimilarity,
            maxPercentage: Math.round(maxSimilarity * 100 * 100) / 100,
            allSimilarities: similarities,
            totalCandidates: candidateVectors.length
        };
    } catch (err) {
        return {
            success: false,
            error: 'Finding most similar failed',
            details: err.message
        };
    }
};