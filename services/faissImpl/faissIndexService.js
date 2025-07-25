const { IndexFlatL2 } = require('faiss-node');

let index = null;
let embeddings = [];
let texts = [];
let dimension = null;

// Initialize the Faiss index
exports.initializeIndex = (dim) => {
    try {
        dimension = dim;
        index = new IndexFlatL2(dim);
        embeddings = [];
        texts = [];
        
        return {
            success: true,
            message: `Faiss index initialized with dimension ${dim}`
        };
    } catch (err) {
        return {
            success: false,
            error: 'Failed to initialize Faiss index',
            details: err.message
        };
    }
};

// Add single embedding to index
exports.addEmbedding = (text, embedding) => {
    try {
        if (!index) {
            throw new Error('Index not initialized. Call initializeIndex first.');
        }

        if (!text || typeof text !== 'string') {
            throw new Error('Text must be a non-empty string');
        }

        if (!Array.isArray(embedding) || embedding.length !== dimension) {
            throw new Error(`Embedding must be an array of length ${dimension}`);
        }

        const embArray = Float32Array.from(embedding);
        index.add(embArray);
        embeddings.push(embArray);
        texts.push(text);

        return {
            success: true,
            message: 'Embedding added successfully',
            total_count: texts.length
        };
    } catch (err) {
        return {
            success: false,
            error: 'Failed to add embedding',
            details: err.message
        };
    }
};

// Add multiple embeddings to index
exports.addBatch = (textArray, embeddingArray) => {
    try {
        if (!index) {
            throw new Error('Index not initialized. Call initializeIndex first.');
        }

        if (!Array.isArray(textArray) || !Array.isArray(embeddingArray)) {
            throw new Error('Both textArray and embeddingArray must be arrays');
        }

        if (textArray.length !== embeddingArray.length) {
            throw new Error('Text and embedding arrays must have the same length');
        }

        let addedCount = 0;

        textArray.forEach((text, idx) => {
            const result = exports.addEmbedding(text, embeddingArray[idx]);
            if (result.success) {
                addedCount++;
            }
        });

        return {
            success: true,
            message: `Batch processing completed`,
            added_count: addedCount,
            total_count: texts.length
        };
    } catch (err) {
        return {
            success: false,
            error: 'Failed to add batch embeddings',
            details: err.message
        };
    }
};

// Search for k-nearest neighbors
exports.search = (embedding, k = 5) => {
    try {
        if (!index) {
            throw new Error('Index not initialized. Call initializeIndex first.');
        }

        if (!Array.isArray(embedding) || embedding.length !== dimension) {
            throw new Error(`Query embedding must be an array of length ${dimension}`);
        }

        if (texts.length === 0) {
            return {
                success: true,
                labels: [],
                distances: [],
                texts: [],
                message: 'No embeddings in index to search'
            };
        }

        const queryVec = Float32Array.from(embedding);
        const results = index.search(queryVec, Math.min(k, texts.length));

        return {
            success: true,
            labels: Array.from(results.labels),
            distances: Array.from(results.distances),
            texts: results.labels.map(lbl => texts[lbl]),
            query_count: k,
            results_count: results.labels.length
        };
    } catch (err) {
        return {
            success: false,
            error: 'Search failed',
            details: err.message
        };
    }
};

// Get total number of vectors in index
exports.getTotal = () => {
    try {
        if (!index) {
            throw new Error('Index not initialized. Call initializeIndex first.');
        }

        return {
            success: true,
            total: index.ntotal(),
            dimension: dimension
        };
    } catch (err) {
        return {
            success: false,
            error: 'Failed to get total count',
            details: err.message
        };
    }
};