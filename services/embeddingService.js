require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI with API key
const initializeGemini = (apiKey = process.env.GEMINI_API_KEY) => {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing in environment variables');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'embedding-001' });
};

// Get embedding vector for a given text
exports.getEmbedding = async (text) => {
    try {
        if (!text || typeof text !== 'string') {
            throw new Error('Input must be a non-empty string');
        }
        
        const model = initializeGemini();
        const result = await model.embedContent(text);
        
        // Return the embedding vector
        return {
            success: true,
            embedding: result.embedding.values
        };
    } catch (err) {
        return {
            success: false,
            error: 'Gemini embedding failed',
            details: err.message
        };
    }
};

// Get embeddings for multiple texts
exports.getBatchEmbeddings = async (texts) => {
    try {
        if (!Array.isArray(texts) || texts.length === 0) {
            throw new Error('Input must be a non-empty array of strings');
        }

        const model = initializeGemini();
        const embeddings = [];

        for (const text of texts) {
            if (!text || typeof text !== 'string') {
                throw new Error('All inputs must be non-empty strings');
            }
            const result = await model.embedContent(text);
            embeddings.push(result.embedding.values);
        }

        return {
            success: true,
            embeddings: embeddings,
            count: embeddings.length
        };
    } catch (err) {
        return {
            success: false,
            error: 'Batch embedding failed',
            details: err.message
        };
    }
};

// Average multiple embedding vectors
exports.averageVectors = (vectors) => {
    try {
        if (!Array.isArray(vectors) || vectors.length === 0) {
            return {
                success: false,
                error: 'Input must be a non-empty array of vectors'
            };
        }

        const dim = vectors[0].length;
        const sum = Array(dim).fill(0);
        
        vectors.forEach(vec => {
            for (let i = 0; i < dim; i++) {
                sum[i] += vec[i];
            }
        });
        
        const averaged = sum.map(v => v / vectors.length);
        
        return {
            success: true,
            averagedVector: averaged,
            dimension: dim,
            vectorCount: vectors.length
        };
    } catch (err) {
        return {
            success: false,
            error: 'Vector averaging failed',
            details: err.message
        };
    }
};

// Calculate cosine similarity between two vectors
exports.calculateSimilarity = (vector1, vector2) => {
    try {
        if (!Array.isArray(vector1) || !Array.isArray(vector2)) {
            throw new Error('Both inputs must be arrays');
        }
        
        if (vector1.length !== vector2.length) {
            throw new Error('Vectors must have the same dimension');
        }

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < vector1.length; i++) {
            dotProduct += vector1[i] * vector2[i];
            norm1 += vector1[i] * vector1[i];
            norm2 += vector2[i] * vector2[i];
        }

        const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));

        return {
            success: true,
            similarity: similarity,
            percentage: Math.round(similarity * 100 * 100) / 100 // Round to 2 decimal places
        };
    } catch (err) {
        return {
            success: false,
            error: 'Similarity calculation failed',
            details: err.message
        };
    }
};