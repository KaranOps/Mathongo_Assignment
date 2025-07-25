const { processQuestions } = require('../services/questionProcessor');
const fs = require('fs');
const path = require('path');

// Test script to process sample questions and generate output
async function testSampleQuestions() {
    try {
        console.log(' Starting Question Similarity Detection...\n');
        
        // Load sample questions
        const sampleQuestions = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../data/sampleQuestions.json'), 'utf-8')
        );
        
        console.log(` Loaded ${sampleQuestions.length} sample questions`);
        console.log(' Processing questions for similarity detection...\n');
        
        // Process questions with threshold 0.8
        const result = await processQuestions(sampleQuestions, 0.8);
        
        if (!result.success) {
            throw new Error(result.details || result.error);
        }
        
        const results = result.results;
        const replicas = results.filter(r => r.is_replica);
        
        // Display summary
        console.log(' SIMILARITY DETECTION RESULTS:');
        console.log('================================');
        console.log(`Total Question Pairs Analyzed: ${results.length}`);
        console.log(`Replica Pairs Found (>= 0.8): ${replicas.length}`);
        console.log(`Unique Questions: ${sampleQuestions.length - replicas.length}`);
        console.log(`Processing Success: \n`);
        
        // Display replica pairs
        if (replicas.length > 0) {
            console.log(' DETECTED REPLICA PAIRS:');
            console.log('==========================');
            replicas.forEach((replica, index) => {
                console.log(`\n${index + 1}. Similarity: ${replica.similarity_score} (${replica.similarity_category})`);
                console.log(`   Q1: "${replica.question1}"`);
                console.log(`   Q2: "${replica.question2}"`);
            });
        }
        
        // Save results to JSON
        const outputData = {
            metadata: {
                total_questions: sampleQuestions.length,
                total_pairs: results.length,
                replica_pairs: replicas.length,
                threshold_used: 0.8,
                timestamp: new Date().toISOString()
            },
            replica_pairs: replicas,
            all_results: results
        };
        
        const outputDir = path.join(__dirname, '../output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const jsonOutputFile = path.join(outputDir, 'similarity_results.json');
        fs.writeFileSync(jsonOutputFile, JSON.stringify(outputData, null, 2));
        
        // Save results to CSV
        const csvHeader = 'Question1,Question2,Similarity_Score,Is_Replica,Similarity_Category\n';
        const csvRows = results.map(r => 
            `"${r.question1.replace(/"/g, '""')}","${r.question2.replace(/"/g, '""')}",${r.similarity_score},${r.is_replica},${r.similarity_category}`
        );
        const csvContent = csvHeader + csvRows.join('\n');
        
        const csvOutputFile = path.join(outputDir, 'similarity_results.csv');
        fs.writeFileSync(csvOutputFile, csvContent);
        
        console.log(`\n Results saved to:`);
        console.log(`   JSON: ${jsonOutputFile}`);
        console.log(`   CSV:  ${csvOutputFile}`);
        console.log('\n Test completed successfully!');
        
    } catch (error) {
        console.error(' Test failed:', error.message);
        process.exit(1);
    }
}

// Run the test
if (require.main === module) {
    testSampleQuestions();
}

module.exports = testSampleQuestions;